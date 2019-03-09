import React from 'react';
import axios from './axios';
import { Box, Button, Collapsible, Heading, Grommet, Layer, ResponsiveContext, TextInput} from 'grommet';

import { FormClose, Notification, Login, UserAdd } from 'grommet-icons';




const theme = {
    global: {
        colors: {
             brand: '#7552D3',
          },

      font: {
        family: 'Roboto',
        size: '14px',
        height: '20px',
      },
      "medium": {
        "size": "18px",
        "height": "24px",
        "maxWidth": "432px"
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


export class Login2 extends React.Component{
    constructor(props){
        super(props)
        this.state={
            error:false
        }
        this.handleChange = this.handleChange.bind(this)
        this.submit = this.submit.bind(this)
    }
    
    handleChange(e){
        this[e.target.name] = e.target.value;
        console.log(e.target.value)
    }
    
    submit() {
        axios.post('/login', {
            email: this.email,
            password: this.password
        }).then(({data}) => {
            console.log(data)
            //subbed out data.success for data.id for now, need to figure out where success comes from
            if (data.success) {
                location.replace('/');  
            } else {
                this.setState({
                    error: true
                });
            }
        });
    }


    render(){
        return <div>
        {this.state.error && <div className="error">Ooops!</div>}   
        <Grommet theme={theme} full>
        <ResponsiveContext.Consumer>
        {size => (
         <Box fill>
         <AppBar>
         <Heading level='3' margin='none'>My App</Heading>
       </AppBar>
           <Box direction='row' flex overflow={{ horizontal: 'hidden' }}>
             <Box flex align='center' justify='center'>        
             <Box width='medium' 
             border={{ color: 'brand', size: 'large' }}
             pad="medium" background="light-3"
             >
             <TextInput
             name="email" 
      placeholder="Email"
              onChange={this.handleChange}
      />
      <TextInput
      name="password" 
      placeholder="password"
       onChange={this.handleChange}
       type='password'
      />
      <Button
      icon={<Login/>}
      label="Login"
        onClick={this.submit}
      />
      <h4>Not a Member Yet?</h4>
      <Button
        icon={<UserAdd/>}
        label="Register"
      />
             </Box>

             </Box>
                    
           </Box>
         </Box>
            )}
        </ResponsiveContext.Consumer>
        </Grommet>
        </div>
    }
}


// <Grommet theme={theme} full>
// <ResponsiveContext.Consumer>
// {size => (
//  <Box fill>
//     <AppBar>
//       <Heading level='3' margin='none'>My App</Heading>
//     </AppBar>
//    <Box direction='row' flex overflow={{ horizontal: 'hidden' }}>
//      <Box flex align='center' justify='center'>
//        app body

//        <TextInput
//        name="email" 
//         value="Email"
//         onChange={this.handleChange}
// />
// <TextInput
// name="password" 
//  value="Password"
//  onChange={this.handleChange}
// />
// <Button
//   icon={<Login/>}
//   label="Login"
//   onClick={this.submit}
// />
// <h4>Not a Member Yet?</h4>
// <Button
//   icon={<UserAdd/>}
//   label="Register"
// />
//      </Box>
//      {(!showSidebar || size !== 'small') ? (
//                  <Collapsible direction="horizontal" open={showSidebar}>

//   </Collapsible>
//    ): (
//        <Layer>
//         <Box
// background='light-2'
// tag='header'
// justify='end'
// align='center'
// direction='row'
// >

// </Box>
//        </Layer>
//           )}

//    </Box>
//  </Box>
//     )}
// </ResponsiveContext.Consumer>
// </Grommet>