import { useState } from 'react'
import BarcodeScanner from 'react-qr-barcode-scanner'

const MobileScanPage = () => {
  const [data, setData] = useState('Not Found')

  const [stopStream, setStopStream] = useState(false)

  return (
    <>
      <BarcodeScanner
        width={500}
        height={500}
        onUpdate={(err, result) => {
          console.log('result', result)
          if (result) setData(result.text)
          else setData('Not Found')
        }}
        onError={(error) => {
          if (error.name === 'NotAllowedError') {
            alert('not allowed')
            // Handle messaging in our app after the user chooses to not allow the camera permissions
          }
        }}
      />
      <p>{data}</p>
    </>
  )
}

export default MobileScanPage
