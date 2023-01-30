import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useQuery } from 'react-query'
import "./App.scss"

//Icons

const SearchIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="icon icon-tabler icon-tabler-search"
    width={24}
    height={24}
    strokeWidth={2}
    stroke="var(--smoke)"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M0 0h24v24H0z" stroke="none" />
    <circle cx={10} cy={10} r={7} />
    <path d="m21 21-6-6" />
  </svg>
)

const PlayIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="icon icon-tabler icon-tabler-player-play"
    width={24}
    height={24}
    strokeWidth={2}
    stroke="transparent"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M0 0h24v24H0z" stroke="none" />
    <path d="M7 4v16l13-8z" fill='var(--purple)' />
  </svg>
)

const MoonIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="icon icon-tabler icon-tabler-moon"
    width={24}
    height={24}
    strokeWidth={2}
    stroke="var(--dark)"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M0 0h24v24H0z" stroke="none" />
    <path d="M12 3h.393a7.5 7.5 0 0 0 7.92 12.446A9 9 0 1 1 12 2.992z" />
  </svg>
)

const App = () => {

  const [text, setText] = useState("mouse");
  const [bucket, setBucket] = useState("");


  const handleButtonClick = () => {
    const theme = document.documentElement.getAttribute("theme")

    if (theme == "dark") {
      document.documentElement.removeAttribute("theme")
    } else {
      document.documentElement.setAttribute("theme", "dark")
    }

  }


  const playMusic = (source) => {
    const audio = new Audio(source)
    audio.play();
  }

  const handleEnter = (e) => {

    if (e.code == "Enter") {
      setBucket(text)
    }

  }


  const fetchWord = async () => {
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${text}`
    const res = await fetch(url)
    return res.json()
  }

  const { data, error, isLoading } = useQuery(["search", bucket], fetchWord)


  return (
    <>
      <div className="container">
        <div className="header">
          <a href="#" className='logo'>
            <img src="logo.svg" alt="" />
          </a>
          <button className='theme_btn' onClick={handleButtonClick}><MoonIcon /></button>
        </div>

        <section id='search_section'>
          <div className='search'>
            <input type="text" placeholder='Enter Text' value={text} onChange={(e) => { setText(e.target.value) }} onKeyDown={handleEnter} />
            <SearchIcon />
          </div>
        </section>

        {
          error && "API is sucks !"
        }

        {
          isLoading && <div>We are looking keyword ....</div>
        }


        {
          data?.map((item, i) => {
            return (
              <div key={i} className="test">
                <section >
                  <div className='text_hero'>
                    <div>
                      <h1 className='c_dark'>{item.word} </h1>
                      <span className='speak_text'>{item.phonetic} </span>
                    </div>
                    {
                      item.phonetics.length > 0 && <button className='play_btn' onClick={() => { playMusic(item.phonetics[0].audio) }}>
                        <PlayIcon />
                      </button>
                    }

                  </div>
                </section>

                {
                  item["meanings"].map((mean, i) => {
                    return (
                      <section key={i}>
                        <div className='secton_header'>
                          <span className='c_dark'>{mean["partOfSpeech"]}</span>
                          <hr />
                        </div>

                        <span className='c_smoke'>Meaning</span>
                        <ul className='meaning'>

                          {
                            mean["definitions"].map((det, i) => {
                              return (
                                <li key={i}>
                                  <p>{det.definition}</p>
                                </li>
                              )
                            })
                          }

                        </ul>


                      </section>
                    )
                  })
                }

                <section id='source'>
                  <div className='source_content'>
                    <span>Source</span>
                    <a href={item.sourceUrls}>{item.sourceUrls[0]}</a>
                  </div>
                </section>

              </div>

            )

          })
        }








      </div>

    </>
  )
}

export default App