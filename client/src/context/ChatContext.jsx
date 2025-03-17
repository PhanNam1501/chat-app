import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
    const [userChats, setUserChats] = useState(null);
    const [isUserChatsLoading, setIsUserChatLoadings] = useState(false);
    const [userChatsError, setUserChatsError] = useState(null);
    const [potentialChats, setPotentialChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState(null);
    const [isMessagesLoading, setIsMessagesLoading] = useState(false);
    const [messagesError, setMessagesError] = useState(null)

    console.log("currentChat", currentChat);
    useEffect(() => {
        const getUsers = async () => {
            console.log("User", user);
            const response = await getRequest(`${baseUrl}/users`);
            if (response.error) {
                return console.log("Error fetching users", response);
            }

            const pChats = response.filter((u) => {
                let isChatCreated = false;
                if (user?._id === u._id) return false;

                if (userChats) {
                    isChatCreated = userChats?.some((chat) => {
                        return chat.members[0] === u._id || chat.members[1] === u._id;
                    });
                }

                return !isChatCreated;
            })
            setPotentialChats(pChats);
        };

        getUsers();
    }, [userChats]);

    useEffect(() => {
        const getUserChats = async () => {
            if (user?._id) {
                console.log(user._id);

                setIsUserChatLoadings(true);

                setUserChatsError(null);

                const response = await getRequest(`${baseUrl}/chats/${user?._id}`);

                setIsUserChatLoadings(false);

                if (response.error) {
                    return setUserChatsError(response);
                }

                setUserChats(response)
            }
        };
        getUserChats();
    }, [user]);

    useEffect(() => {
        const getMessages = async () => {
            if (user?._id) {
                console.log(user._id);

                setIsMessagesLoadings(true);

                setMessagesError(null);

                const response = await getRequest(`${baseUrl}/messages/${currentChat?._id}`);

                setIsMessagestLoadings(false);

                if (response.error) {
                    return setMessagesError(response);
                }

                setMessages(response)
            }
        };
        getMessages();
    }, [user]);

    const updateCurrentChat = useCallback( async (chat) => {
        setCurrentChat(chat);

    }, [])

    const createChat = useCallback(async(firstId, secondId) => {
        const response = await postRequest(`${baseUrl}/chats`,
            JSON.stringify({
                firstId,
                secondId,
            })
        );

        if (response.error) {
            return console.log("Enter creating chat", response);
        }

        setUserChats((prev) => [...prev, response]);
    }, []);

    return <ChatContext.Provider
        value={{
            userChats,
            isUserChatsLoading,
            userChatsError,
            potentialChats,
            createChat,
            updateCurrentChat,
        }}
    >
        {children}
    </ChatContext.Provider>

}