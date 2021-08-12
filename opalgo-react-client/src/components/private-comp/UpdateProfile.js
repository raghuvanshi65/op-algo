import React, { useState, useContext } from 'react'
import '../../stylesheets/updateProfile.css'

import { Redirect } from 'react-router-dom'
import { authenticate, isAuth } from '../../helpers/auth'
import Logo from '../../assets/O2.svg'
import { motion } from 'framer-motion'
import { Tooltip, Upload } from 'antd'
import ImgCrop from 'antd-img-crop'

import { GlobalAuthContext } from '../../contexts/GlobalAuthContext'

const redirectFunction = (data) => {
  if (data) {
    if (!data.logInfo.profileUpdated) return <Redirect to="/updateProfile" />
    else return <Redirect to="/home" />
  } else return <Redirect to="/" />
}

const toolTipStyle = {
  margin: 80 * 4 + 24,
  backgroundColor: 'blue',
}

export const UpdateProfile = () => {
  const { storedUser } = useContext(GlobalAuthContext)
  console.log(storedUser)
  const [formData, setFormData] = useState({ ...storedUser })
  const [platform, setPlatform] = useState(
    storedUser.platform ? storedUser.platform : [],
  )
  const [languages, setLanguages] = useState(
    storedUser.languages ? storedUser.languages : [],
  )
  const [fileList, setFileList] = useState([])

  const [auth, setAuth] = useState(isAuth())

  const handleChange = (field, e) => {
    setFormData((prev) => ({
      ...formData,
      [field]: e.target.value,
    }))
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
            <form>
              <ImgCrop
                grid
                shape="round"
                fillColor="#222222"
                rotate={true}
                modalOk="Upload"
                modalTitle="Crop Before Uploading"
              >
                <Upload
                  listType="picture-card"
                  onPreview={onPreview}
                  style={{
                    width: '50px',
                  }}
                >
                  {'+ Upload'}
                </Upload>
              </ImgCrop>
            </form>
          </div>
          <div className="updateProfile-formdata">
            <form id="updateForm">
              <Tooltip title="Email" placement="right" color={'green'}>
                <div className="form-div">
                  <input
                    type="text"
                    className="form-input"
                    value={storedUser.email}
                    disabled
                  />
                </div>
              </Tooltip>

              <Tooltip title="name" placement="right" color={'green'}>
                <div className="form-div">
                  <input
                    type="text"
                    className="form-input"
                    value={storedUser.name}
                    disabled
                  />
                </div>
              </Tooltip>

              <Tooltip title="code" placement="right" color={'red'}>
                <div className="form-div">
                  <input
                    type="number"
                    max="9999"
                    min="1000"
                    className="form-input"
                    value={formData.code}
                    onChange={(e) => handleChange('code', e)}
                  />
                </div>
              </Tooltip>

              <Tooltip title="username" placement="right" color={'red'}>
                <div className="form-div">
                  <input
                    type="text"
                    className="form-input"
                    value={formData.username}
                    onChange={(e) => handleChange('username', e)}
                  />
                </div>
              </Tooltip>

              <Tooltip title="bio" placement="right" color={'red'}>
                <div className="form-div">
                  <input
                    type="text"
                    className="form-input"
                    value={formData.bio}
                    onChange={(e) => handleChange('username', e)}
                  />
                </div>
              </Tooltip>

              <Tooltip title="bio" placement="right" color={'red'}>
                <div className="form-div">
                  <input
                    type="text"
                    className="form-input"
                    value={formData.bio}
                    onChange={(e) => handleChange('username', e)}
                  />
                </div>
              </Tooltip>
              <Tooltip title="bio" placement="right" color={'red'}>
                <div className="form-div">
                  <input
                    type="text"
                    className="form-input"
                    value={formData.bio}
                    onChange={(e) => handleChange('username', e)}
                  />
                </div>
              </Tooltip>
              <Tooltip title="bio" placement="right" color={'red'}>
                <div className="form-div">
                  <input
                    type="text"
                    className="form-input"
                    value={formData.bio}
                    onChange={(e) => handleChange('username', e)}
                  />
                </div>
              </Tooltip>
              <Tooltip title="bio" placement="right" color={'red'}>
                <div className="form-div">
                  <input
                    type="text"
                    className="form-input"
                    value={formData.bio}
                    onChange={(e) => handleChange('username', e)}
                  />
                </div>
              </Tooltip>
              <Tooltip title="bio" placement="right" color={'red'}>
                <div className="form-div">
                  <input
                    type="text"
                    className="form-input"
                    value={formData.bio}
                    onChange={(e) => handleChange('username', e)}
                  />
                </div>
              </Tooltip>

              <div className="form-div">
                <h3>Public Profiles</h3>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
