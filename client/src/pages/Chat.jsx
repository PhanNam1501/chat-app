import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { Container, Stack } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import  UserChat from "../components/chat/UserChat"
import PotentialChats from "../components/chat/PotentialChats";

const Chat = () => {
    const { user } = useContext(AuthContext);

    const { userChats,
        isUserChatsLoading,
        updateCurrentChat } = useContext(ChatContext);

    console.log("UserChats", userChats);
    return (
        <Container>
            <PotentialChats />
            {userChats?.length < 1 ? null : (
                <Stack direction="horizontal" gap={4} className="align-items-start">
                    <Stack className="messages-box flex-grow-0 pe-3" gap={3}>
                        {isUserChatsLoading && <p>Loading chats...</p>}
                        {userChats?.map((chat, index) => {
                            return(
                                <div key={index} onClick={() => updateCurrentChat(chat)}>
                                    <UserChat chat={chat} user={user}/>
                                </div>
                            )
                        })}
                    </Stack>
                    <p>ChatBox</p>
                </Stack>
            )}
        </Container>
    );
};

export default Chat;