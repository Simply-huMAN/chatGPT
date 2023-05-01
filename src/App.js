import { useState, useEffect } from "react";

function App() {
  const [value, setValue] = useState("");
  const [message, setMessage] = useState(null);
  const [previousChats, setPreviousChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);

  // options for selection of mood, character, subject and others.
  const [character, setCharacter] = useState("normal");
  const [mood, setMood] = useState("normal");
  const [expertise, setExpertise] = useState("normal");
  const [conversationStyle, setConversationStyle] = useState("normal");
  const [temperature, setTemperature] = useState(1);

  const createNewChat = () => {
    setMessage(null);
    setValue("");
    setCurrentTitle(null);
  };

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle);
    setMessage(null);
    setValue("");
  };

  const getMessages = async () => {
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: value,
        character: { character },
        mood: { mood },
        expertise: { expertise },
        conversationStyle: { conversationStyle },
        temperature: { temperature },
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await fetch(
        "http://localhost:8000/completions",
        options
      );
      const data = await response.json();
      setMessage(data.choices[0].message);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log(currentTitle, value, message);
    if (!currentTitle && value && message) setCurrentTitle(value);
    if (currentTitle && value && message) {
      setPreviousChats((prevChats) => [
        ...prevChats,
        { title: currentTitle, role: "user", content: value },
        { title: currentTitle, role: message.role, content: message.content },
      ]);
    }
  }, [message, currentTitle]);

  console.log(previousChats);

  const currentChat = previousChats.filter(
    (previousChat) => previousChat.title === currentTitle
  );
  const uniqueTitles = Array.from(
    new Set(previousChats.map((previousChat) => previousChat.title))
  );
  console.log(uniqueTitles);

  return (
    <div className="app">
      <section className="side-bar flex flex-col justify-between h-screen bg-blue-500 w-72">
        <button
          onClick={createNewChat}
          className="bg-blue-800 p-3 m-1 rounded-md"
        >
          New Chat
        </button>
        <ul className="history h-full flex flex-col items-center m-3 py-3">
          {uniqueTitles?.map((uniqueTitle, index) => (
            <li
              key={index}
              onClick={() => handleClick(uniqueTitle)}
              className="py-3 cursor-pointer w-full rounded-md"
            >
              {uniqueTitle}
            </li>
          ))}
        </ul>
        <nav className="bg-blue-800 p-3 text-center">
          <p>Made by Aditya</p>
        </nav>
      </section>
      <section className="main h-screen w-full flex flex-col justify-between items-center text-center">
        {!currentTitle && <h1>AdityaGPT</h1>}
        <ul className="feed w-full overflow-y-auto flex flex-col">
          {currentChat?.map((chatMessage, index) => {
            if (index % 2) {
              return (
                <li
                  key={index}
                  className="max-w-3xl self-start text-left bg-blue-500 px-4 py-2 rounded-md rounded-bl-none my-1 mx-2"
                >
                  <p className="role font-medium">{chatMessage.role}</p>
                  <p>{chatMessage.content}</p>
                </li>
              );
            } else {
              return (
                <li
                  key={index}
                  className="max-w-3xl self-end text-right bg-blue-800 px-4 py-2 rounded-md rounded-br-none my-2 mx-2"
                >
                  <p className="role font-medium">{chatMessage.role}</p>
                  <p>{chatMessage.content}</p>
                </li>
              );
            }
          })}
        </ul>
        <div className="bottomSection w-full flex flex-col justify-center items-center">
          <div className="flex flex-col">
            <div className="flex">
              <select
                className="m-1 bg-blue-500 px-2 py-1 rounded-md"
                value={character}
                onChange={(e) => setCharacter(e.target.value)}
              >
                <option value="normal">--select-character--</option>
                <option value="Captain Jack Sparrow">
                  Captain Jack Sparrow
                </option>
                <option value="Iron Man">Iron Man</option>
                <option value="Loki">Loki</option>
                <option value="Gazini">Gazini</option>
                <option value="Dora the explorer">Dora</option>
              </select>
              <select
                className="m-1 bg-blue-500 px-2 py-1 rounded-md"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
              >
                <option value="normal">--select-personality--</option>
                <option value="Confident">Confident</option>
                <option value="Angry">Angry</option>
                <option value="Passionate">Passionate</option>
                <option value="Calm">Calm</option>
                <option value="Empathetic">Empathetic</option>
                <option value="Impatient">Impatient</option>
              </select>
              <select
                className="m-1 bg-blue-500 px-2 py-1 rounded-md"
                value={expertise}
                onChange={(e) => setExpertise(e.target.value)}
              >
                <option value="normal">--select-expertise--</option>
                <option value="Language">Language</option>
                <option value="Code">Code</option>
                <option value="Maths">Maths</option>
              </select>
              <select
                className="m-1 bg-blue-500 px-2 py-1 rounded-md"
                value={conversationStyle}
                onChange={(e) => setConversationStyle(e.target.value)}
              >
                <option value="normal">--select-conversation-style--</option>
                <option value="Dramatic">Dramatic</option>
                <option value="Sarcastic">Sarcastic</option>
                <option value="Funny">Funny</option>
                <option value="Laconic">Laconic</option>
                <option value="Cowboy">Cowboy</option>
                <option value="Anime">Anime</option>
              </select>
            </div>
            <div className="flex justify-between">
              <label htmlFor="">Strictness</label>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                className="w-full m-1 bg-blue-600 opacity-70 hover:opacity-100"
              />
            </div>
          </div>
          <div className="inputContainer relative w-full max-w-2xl">
            <input
              type="text"
              name=""
              id="inputText"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Type your query here..."
              className="w-full text-lg border-none bg-blue-300 py-3 px-4 m-1 rounded-md focus:outline-none shadow-lg"
            />
            <div
              id="submit"
              onClick={getMessages}
              className="absolute bottom-3 right-3 cursor-pointer"
            >
              &#8594;
            </div>
          </div>
          <p className="info bg-blue-900 p-3 w-full">
            This is a clone of ChatGPT, the bot answers most of your queries
            except the real-time news.
          </p>
        </div>
      </section>
    </div>
  );
}

export default App;
