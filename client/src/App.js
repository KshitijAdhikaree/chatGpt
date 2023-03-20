//import logo from './logo.svg'
import './App.css'
import './normal.css'
import { useState, useEffect } from 'react'

function App() {
  useEffect(() => {
    getEngines()
  }, [])

  // add state for inpit and chat log
  const [input, setInput] = useState('')
  const [models, setModels] = useState([])
  const [currentModel, setCurrentModel] = useState('ada')

  const [chatLog, setChatLog] = useState([
    {
      user: 'gpt',
      message: ' How can I help?',
    },
    {
      user: 'me',
      message: ' I want to use chatgpt',
    },
  ])

  //Clear chat
  function clearChat() {
    setChatLog([])
  }

  function getEngines() {
    fetch('http://localhost:5000/models')
      .then((res) => res.json())
      .then((data) => {
        console.log(data.models.data)
        setModels(data.models.data)
      })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    let chatLogNew = [...chatLog, { user: 'me', message: `${input}` }]
    setInput('')
    setChatLog(chatLogNew)

    //fetch request to api combining the chat log array of messages adn sending it as a messa to localhost as s a post
    const messages = chatLogNew.map((message) => message.message).join('\n')

    const response = await fetch('http://localhost:5000/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: messages,
        currentModel,
      }),
    })
    const data = await response.json()
    setChatLog([...chatLogNew, { user: 'gpt', message: `${data.message}` }])
  }
  return (
    <div className='App'>
      <aside className='sidemenu'>
        <div className='side-menu-button' onClick={clearChat}>
          <span>+</span>
          New Chat
        </div>
        <div className='models'>
          <select
            onChange={(e) => {
              setCurrentModel(e.target.value)
            }}
          >
            {models.map((model, index) => (
              <option key={model.id} value={model.id}>
                {model.id}
              </option>
            ))}
          </select>
        </div>
      </aside>
      <section className='chatbox'>
        <div className='chat-log'>
          {chatLog.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
        </div>
        <div className='chat-input-holder'>
          <form onSubmit={handleSubmit}>
            <input
              rows='1'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className='chat-input-text-area'
            ></input>
          </form>
        </div>
      </section>
    </div>
  )
}

const ChatMessage = ({ message }) => {
  return (
    <div className={`chat-message ${message.user === 'gpt' && 'chatgpt'}`}>
      <div className='chat-message-center'>
        <div className={`avatar ${message.user === 'gpt' && 'chatgpt'}`}>
          {message.user === 'gpt' && (
            <svg
              width='40'
              height='40'
              viewBox='0 0 512 512'
              xmlns='http://www.w3.org/2000/svg'
              fillRule='evenodd'
              clipRule='evenodd'
              strokeLinejoin='round'
              strokeMiterlimit={2}
            >
              <path
                d='M474.123 209.81c11.525-34.577 7.569-72.423-10.838-103.904-27.696-48.168-83.433-72.94-137.794-61.414a127.14 127.14 0 0 0-95.475-42.49c-55.564 0-104.936 35.781-122.139 88.593-35.781 7.397-66.574 29.76-84.637 61.414-27.868 48.167-21.503 108.72 15.826 150.007-11.525 34.578-7.569 72.424 10.838 103.733 27.696 48.34 83.433 73.111 137.966 61.585 24.084 27.18 58.833 42.835 95.303 42.663 55.564 0 104.936-35.782 122.139-88.594 35.782-7.397 66.574-29.76 84.465-61.413 28.04-48.168 21.676-108.722-15.654-150.008v-.172zm-39.567-87.218c11.01 19.267 15.139 41.803 11.354 63.65-.688-.516-2.064-1.204-2.924-1.72l-101.152-58.49a16.965 16.965 0 0 0-16.687 0L206.621 194.5v-50.232l97.883-56.597c45.587-26.32 103.732-10.666 130.052 34.921zm-227.935 104.42 49.888-28.9 49.887 28.9v57.63l-49.887 28.9-49.888-28.9v-57.63zm23.223-191.81c22.364 0 43.867 7.742 61.07 22.02-.688.344-2.064 1.204-3.097 1.72L186.666 117.26c-5.161 2.925-8.258 8.43-8.258 14.45v136.934l-43.523-25.116V130.333c0-52.64 42.491-95.13 95.131-95.302l-.172.172zM52.14 168.697c11.182-19.268 28.557-34.062 49.544-41.803V247.14c0 6.02 3.097 11.354 8.258 14.45l118.354 68.295-43.695 25.288-97.711-56.425c-45.415-26.32-61.07-84.465-34.75-130.052zm26.665 220.71c-11.182-19.095-15.139-41.802-11.354-63.65.688.516 2.064 1.204 2.924 1.72l101.152 58.49a16.965 16.965 0 0 0 16.687 0L306.568 317.5v50.232l-97.883 56.425c-45.587 26.148-103.732 10.665-130.052-34.75h.172zm204.54 87.39c-22.192 0-43.867-7.741-60.898-22.02a62.439 62.439 0 0 0 3.097-1.72l101.152-58.317c5.16-2.924 8.429-8.43 8.257-14.45V243.527l43.523 25.116v113.022c0 52.64-42.663 95.303-95.131 95.303v-.172zM461.22 343.303c-11.182 19.267-28.729 34.061-49.544 41.63V264.687c0-6.021-3.097-11.526-8.257-14.45L284.893 181.77l43.523-25.116 97.883 56.424c45.587 26.32 61.07 84.466 34.75 130.053l.172.172z'
                fillRule='nonzero'
              />
            </svg>
          )}
        </div>
        <div className='message'>{message.message}</div>
      </div>
    </div>
  )
}
export default App
