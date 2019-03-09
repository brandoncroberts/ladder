import React from "React";
import { connect } from "react-redux";
import { Box, Button, Collapsible, Heading, Grommet, Layer, ResponsiveContext, Paragraph} from 'grommet';

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

const AppBar = (props) => (
    <Box
      tag='header'
      direction='row'
      align='center'
      justify='between'
    background='brand'
      pad={{ left: 'medium', right: 'small', vertical: 'small' }}
      elevation='medium'
      style={{ zIndex: '1' }}
      {...props}
    />
  );
  


class Online extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        const onlineUsers = this.props.onlineUsers;
        if(!onlineUsers){
            return null
        }

        const myOnlineUsers=   <Grommet>
        {onlineUsers.map((user)=>{
            return (

                  <Box>
                    <h2>Online Now:</h2>
                  {user.url ? <img className="profilePic" src={user.url} alt="no picture" /> : <img className="profilePic" src="https://s3.amazonaws.com/spicedling/nTX2xXNwxGyjFeuVTTMpBPZyxEO8HLE1.png"/>} 
                    <h4>{user.first  + " " + user.last}</h4>
                    </Box>
            )

        })}
        
        </Grommet>
        const { showSidebar } = this.state;
    
            return (
                <Grommet theme={theme} full>
                <ResponsiveContext.Consumer>
            {size => (
                 <Box fill>
                    <AppBar>
                      <Heading level='3' margin='none'>My App</Heading>
                         <Button
             icon={<Notification />}
                       onClick={() => this.setState(prevState => ({ showSidebar: !prevState.showSidebar }))}
                     />
                    </AppBar>
                   <Box direction='row' flex overflow={{ horizontal: 'hidden' }}>
                     <Box flex align='center' justify='center'>
            
                     <div>{onlineUsers.length > 0 ? myOnlineUsers : 'no online users'}
                     </div>
            
            
                     </Box>
                     {(!showSidebar || size !== 'small') ? (
                                 <Collapsible direction="horizontal" open={showSidebar}>
                     <Box
                    flex
                       width='medium'
                       background='light-2'
                       elevation='small'
                       align='center'
                       justify='center'
                     >
                       sidebar
                     </Box>
                  </Collapsible>
                   ): (
                       <Layer>
                        <Box
            background='light-2'
             tag='header'
             justify='end'
             align='center'
             direction='row'
            >
             <Button
               icon={<FormClose />}
               onClick={() => this.setState({ showSidebar: false })}
             />
            </Box>
                         <Box
                           fill
                           background='light-2'
                           align='center'
                           justify='center'
                         >
                           sidebar
                           </Box>
                       </Layer>
                          )}
            
                   </Box>
                 </Box>
                    )}
            </ResponsiveContext.Consumer>
                </Grommet>)
        

    }
}

const mapStateToProps = function(state) {
    console.log('state', state);
    
    return {
        onlineUsers: state.onlineUsers
    };
};

export default connect(mapStateToProps)(Online);



