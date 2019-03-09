import React from "React"
import { Box, Button, Collapsible, Heading, Grommet, Layer, ResponsiveContext, Image} from 'grommet';

import { FormClose, Notification } from 'grommet-icons';

const theme = {
  global: {
      colors: {
           brand: '#228BE6',
        },
    font: {
      family: 'Roboto',
      size: '14px',
      height: '20px',
    },
  },
};

  

export default function ProfilePic(props){
    
    return(
        <Grommet theme={theme} >
    

        
        <Box flex align='center'   direction='row'>  

        <h1>Welcome Back {props.first}</h1>

            <Box margin='xlarge'>
            {props.url ? <img className="profilePic" onClick={props.handleShowUploader} src={props.url}/> : <img className="profilePic" onClick={props.handleShowUploader} src="https://s3.amazonaws.com/spicedling/nTX2xXNwxGyjFeuVTTMpBPZyxEO8HLE1.png"/>}
             </Box>


        
             </Box>
                </Grommet>
    )
}



    


