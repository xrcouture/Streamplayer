import React, { useState, useEffect } from 'react'
import './index.css';
import ReactHlsPlayer from 'react-hls-player';
import axios from 'axios';

const App = () => {

  const baseURL = "https://xrcie.onrender.com"

  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [err, setErr] = useState("")

  // useEffect(() => {

  //   if (err.length) {
  //     setTimeout(() => {
  //       setErr("")
  //     }, 10000);
  //   }

  // }, [err])

  const [videoURL, setVideoURL] = useState(false)
  const [isAuth, setIsAuth] = useState(false)

  const onSumbit = async (event) => {

    event.preventDefault()

    // console.log("Submitting to", baseURL + "/validate")
    setIsSubmitting(true)

    await axios.post(baseURL + '/validate', {
      email: email
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      }
    },)
      .then((res) => {
        // console.log(res)
        setIsSubmitting(false)
        setVideoURL(res.data.url)
        setIsAuth(true)
      })
      .catch((err) => {
        // console.log(err)
        setIsSubmitting(false)
        setIsAuth(false)

        if (err.response) {
          if (err.response.data.msg === "Invalid") {
            setErr(<>
              The email address is not registered. Please click <a rel="noreferrer" className='text-primary' target={'_blank'} href='https://xrcouture.com'>here</a> to register.
            </>)
          } else if (err.response.data.msg === "Expired") {
            setErr("The link is expired for this email address. Please contact us at hello@xrcouture.com")
          } else {
            setErr("Something went wrong, Please try again later. Or contact us at hello@xrcouture.com")
          }
        } else {
          setErr("Something went wrong, Please try again later. Or contact us at hello@xrcouture.com")
        }
      })
  }

  const onChange = (e) => {
    setEmail(e.target.value)
    setErr("")
  }

  return (
    <div className='app-container'>


      {!isAuth ?
        <>
          <div className='input-cont'>
            <div className='player-header'>XRC &nbsp; DASHBOARD</div>

            <div className='player-input footer-subscribe-form'>

              <form onSubmit={onSumbit}>
                <input type="email" name="email" placeholder='Enter registred email address' className='footer-subscribe-text w-100' required autoComplete='off' title='' onChange={onChange} />
                <button type="submit" className='footer-subscribe-button' disabled={isSubmitting}>
                  Submit
                </button>
              </form>

            </div>

          </div>

          <div className='output-cont d-flex align-items-center'>

            {isSubmitting ?
              <div class="spinner-border text-light" role="status">
                <span className="sr-only"></span>
              </div> :
              <p className='text-white mt-2'>{err}</p>}

          </div>
        </> :

        <ReactHlsPlayer
          src={videoURL}
          autoPlay={true}
          controls={true}
          width="100%"
          height="auto"
        />
      }

    </div>
  )
}

export default App