import React, { useState } from 'react'
import { Switch } from '@mui/material'

const DataPrivacy = () => {
  const [isOn,setIsOn]= useState(true)
  return (
    <div className='flex flex-col w-full'>
      <h1 className='text-lx font-bold'>Data Privacy</h1>
      <div className='flex justify-between bg-white p-4 w-full my-4 rounded-lg shadow-md'>
        <span className='text-md text-gray-400'>
          Allow Data Sharing
        </span>
        <Switch
          checked={isOn}
          size='small'
          onChange={() => {console.log("Toggled is working"),setIsOn(!isOn)}}
          sx={{
            '& .MuiSwitch-switchBase.Mui-checked': {
              color: '#445E94', 
            },
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
              backgroundColor: '#445E94',
            },}}
        />
      
      </div>
    </div>
  )
}

export default DataPrivacy