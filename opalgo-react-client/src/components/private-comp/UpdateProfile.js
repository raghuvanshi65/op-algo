import React, { useState, useContext, useEffect } from 'react'
import '../../stylesheets/updateProfile.css'

import { Redirect, useHistory } from 'react-router-dom'
import { authenticate, isAuth } from '../../helpers/auth'
import Logo from '../../assets/O2.svg'
import { motion } from 'framer-motion'
import { Upload } from 'antd'
import ImgCrop from 'antd-img-crop'
import axios from 'axios'
import { errorNotify, successNotify } from '../../helpers/notify'

import { GlobalAuthContext } from '../../contexts/GlobalAuthContext'

const redirectFunction = (data) => {
  if (data) {
    if (!data.logInfo.profileUpdated) return <Redirect to="/updateProfile" />
    else return <Redirect to="/home" />
  } else return <Redirect to="/" />
}

export const UpdateProfile = () => {
  let history = useHistory()
  const { storedUser, reloadStoredUser, token } = useContext(GlobalAuthContext)
  const [formData, setFormData] = useState({ ...storedUser })
  const [platform, setPlatform] = useState(
    storedUser.platform ? storedUser.platform : [],
  )
  const [languages, setLanguages] = useState(
    storedUser.languages ? storedUser.languages : [],
  )

  const [file, setFile] = useState(false)

  const [auth, setAuth] = useState(isAuth())

  useEffect(() => {
    reloadStoredUser()
  }, [])

  const handleChange = (field, e) => {
    setFormData((prev) => ({
      ...formData,
      [field]: e.target.value,
    }))
  }

  const handleProfileChange = (e, index, target) => {
    e.preventDefault()
    setPlatform((prev) => [
      ...prev.slice(0, index),
      {
        ...prev[index],
        [target]: e.target.value,
      },
      ...prev.slice(index + 1),
    ])
  }

  const handleLanguageChange = (e, index) => {
    e.preventDefault()
    setLanguages((prev) => [
      ...prev.slice(0, index),
      e.target.value,
      ...prev.slice(index + 1),
    ])
  }

  const addMore = (e) => {
    e.preventDefault()
    setPlatform((prev) => [
      ...prev,
      {
        platform: '',
        url: '',
      },
    ])
  }

  const addMoreLanguages = (e) => {
    e.preventDefault()
    setLanguages((prev) => [...prev, ''])
  }

  const removePlatform = (e, index) => {
    e.preventDefault()
    setPlatform((prev) => [...prev.slice(0, index), ...prev.slice(index + 1)])
  }

  const removeLanguage = (e, index) => {
    e.preventDefault()
    setLanguages((prev) => [...prev.slice(0, index), ...prev.slice(index + 1)])
  }

  const onPreview = async (file) => {
    let src = file.url
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.readAsDataURL(file.originFileObj)
        reader.onload = () => resolve(reader.result)
      })
    }
    const image = new Image()
    image.src = src
    const imgWindow = window.open(src)

    if (imgWindow) {
      imgWindow.document.write(image.outerHTML)
    } else {
      window.location.href = src
    }
  }

  const onChange = async (file) => {
    setFile((prev) => !prev)
  }

  const uploadImage = () => {
    if (file) {
      const imageData = document.getElementsByTagName('img')[1].src

      axios({
        method: 'post',
        url: 'http://localhost:5000/user/upload',
        data: { filename: imageData },
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token.token}`,
        },
      })
        .then((res) => {
          if (res.data.accept)
            return successNotify('Successfullu updated', res.data.message.message)
          else return errorNotify('Not Successful', res.data.message.message)
        })
        .catch((err) => {
          console.log(err)
          errorNotify('Not Successful')
        })
    } else {
      errorNotify('Not Succesful', 'Please Choose a file to Upload')
    }
  }

  const checkEmptyFields = (arr) => {
    arr.forEach((obj) => {
      if (obj === '') return true
      else if (obj.platform === '' || obj.url === '') return true
    })
    return false
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    setFormData(() => ({
      ...formData,
      platform: platform,
      languages: languages,
    }))

    if (
      formData.code === 0 ||
      !formData.code ||
      formData.username === '' ||
      !formData.username ||
      !platform ||
      checkEmptyFields(platform) ||
      !languages ||
      checkEmptyFields(languages)
    )
      return errorNotify(
        'Not SuccesFul',
        'Please Fill All Fields that are required *',
      )

    axios({
      method: 'post',
      url: 'http://localhost:5000/user/updateinfo',
      data: formData,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token.token}`,
      },
    })
      .then(async (res) => {
        if (!res.data)
          return errorNotify(
            'Not Succesful',
            'Internal Server Error , Wait for Some time',
          )
        if (res.data.accept) {
          await informParent(res)
          return successNotify('Successfullu updated', res.data.message)
        }
        return errorNotify('Not Successful', res.data.accept)
      })
      .catch((err) => {
        console.log(err)
        errorNotify('Not succesful', err.response)
      })
  }

  const informParent = async (res) => {
    await authenticate(res, () => {
      const auth = isAuth()
      if (auth && auth.Role === 'Admin') history.push('/admin')
      else history.push('/home')
    })
  }

  return (
    <>
      {redirectFunction(auth)}
      <div className="UpdateProfile">
        <div className="updateProfile-header">
          <motion.img
            animate={{ scale: [0.8, 1], opacity: [0, 1] }}
            transition={{ duration: 0.4 }}
            src={Logo}
            alt=""
            width="100"
          ></motion.img>
          <h2>Update Your Profile to continue</h2>
        </div>
        <div className="updateProfile-form">
          <div className="updateProfile-pic">
            <h2>Upload Your Profile</h2>
            <form encType="multipart/form-data">
              <ImgCrop
                grid
                shape="round"
                fillColor="#222222"
                modalOk="Upload"
                modalTitle="Crop Image"
              >
                <Upload
                  id="profile-image"
                  listType="picture-card"
                  onPreview={onPreview}
                  onChange={onChange}
                  style={{
                    width: '50px',
                  }}
                  beforeUpload={() => false}
                >
                  {!file && '+ Upload'}
                </Upload>
              </ImgCrop>
              <button
                type="button"
                value="upload image"
                onClick={() => uploadImage()}
                className="updates"
              >
                Upload Image
              </button>
            </form>
          </div>
          <div className="updateProfile-formdata">
            <form id="updateForm">
              <div className="form-div">
                <div className="labels">
                  Email{' '}
                  <span style={{ color: 'white', fontSize: '1rem' }}>*</span>{' '}
                </div>
                <input
                  type="text"
                  className="form-input"
                  value={storedUser.email}
                  disabled
                />
              </div>

              <div className="form-div">
                <div className="labels">
                  Name{' '}
                  <span style={{ color: 'white', fontSize: '1rem' }}>*</span>{' '}
                </div>
                <input
                  type="text"
                  className="form-input"
                  value={storedUser.name}
                  disabled
                />
              </div>

              <div className="form-div">
                <div className="labels">
                  4 digit code{' '}
                  <span style={{ color: 'white', fontSize: '1rem' }}>*</span>{' '}
                </div>
                <input
                  type="number"
                  max="9999"
                  min="1000"
                  className="form-input"
                  value={formData.code}
                  onChange={(e) => handleChange('code', e)}
                />
              </div>

              <div className="form-div">
                <div className="labels">
                  username{' '}
                  <span style={{ color: 'white', fontSize: '1rem' }}>*</span>{' '}
                </div>
                <input
                  type="text"
                  className="form-input"
                  value={formData.username}
                  onChange={(e) => handleChange('username', e)}
                />
              </div>

              <div className="form-div">
                <div className="labels">bio</div>
                <textarea
                  type="text"
                  className="form-input"
                  value={formData.bio}
                  onChange={(e) => handleChange('bio', e)}
                />
              </div>

              <br />
              <div className="form-div" id="public-profiles">
                <h3 className="heading">Public Profiles :</h3>
                <button
                  type="button"
                  className="add-more"
                  onClick={(e) => addMore(e)}
                >
                  Add More Public Profiles
                </button>
                <div id="profile-list">
                  {platform.map((obj, index) => {
                    return (
                      <div className="profiles" key={index}>
                        <div>
                          <p>
                            Platform name{' '}
                            <span style={{ color: 'white', fontSize: '1rem' }}>
                              *
                            </span>{' '}
                          </p>
                          <input
                            type="text"
                            key={index}
                            value={platform[index].platform}
                            onChange={(e) =>
                              handleProfileChange(e, index, 'platform')
                            }
                            className="form-input"
                          />
                        </div>
                        <div>
                          <p>
                            url{' '}
                            <span style={{ color: 'white', fontSize: '1rem' }}>
                              *
                            </span>{' '}
                          </p>
                          <input
                            type="url"
                            key={index}
                            value={platform[index].url}
                            onChange={(e) =>
                              handleProfileChange(e, index, 'url')
                            }
                            className="form-input"
                          />
                        </div>
                        <button
                          className="remove"
                          onClick={(e) => removePlatform(e, index)}
                        >
                          remove {platform[index].platform}
                        </button>
                        <br />
                        <br />
                      </div>
                    )
                  })}
                </div>
                <br />
                <div id="languages">
                  <h3 className="heading">Coding Languages Familiar With :</h3>
                  <button
                    type="button"
                    className="add-more"
                    onClick={(e) => addMoreLanguages(e)}
                  >
                    Add More
                  </button>
                </div>
                <br />
                <div id="language-list">
                  {languages.map((obj, index) => {
                    return (
                      <div className="language" key={index}>
                        <div>
                          <p>
                            Language name
                            <span style={{ color: 'white', fontSize: '1rem' }}>
                              *
                            </span>{' '}
                          </p>
                          <input
                            type="text"
                            key={index}
                            value={languages[index]}
                            onChange={(e) => handleLanguageChange(e, index)}
                            className="form-input"
                          />
                        </div>
                        <button
                          className="remove"
                          onClick={(e) => removeLanguage(e, index)}
                        >
                          remove {languages[index].platform}
                        </button>
                        <br />
                        <br />
                      </div>
                    )
                  })}
                </div>
              </div>
              <br />
              <div className="form-div">
                <motion.button
                  type="submit"
                  whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{
                    scale: 1,
                    transition: { duration: 0 },
                  }}
                  className="updates"
                  onClick={(e) => handleFormSubmit(e)}
                >
                  Submit
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
