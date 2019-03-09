import React from 'react';
import axios from './axios';
import { Link } from 'react-router-dom';
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

export class Registration2 extends React.Component{
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
        axios.post('/register', {
            first: this.first,
            last: this.last,
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
        name="first" 
        placeholder="First Name"
         onChange={this.handleChange}
        />
        <TextInput
        name="last" 
        placeholder="Last Name"
         onChange={this.handleChange}
    />
    
    <TextInput
    name="email" 
    placeholder="Email"
     onChange={this.handleChange}
    />
    <TextInput
    name="password" 
    placeholder="Password"
     onChange={this.handleChange}
     type='password'
    />
    <Button
    icon={<UserAdd/>}
    label="Register"
    onClick={this.submit}
    />
    </Box>

        <h4>Already A Member?</h4>
        <Link to="/login">  
        <Button
        icon={<Login/>}
        label="Login"
        />
           
       </Link>
    
    
             </Box>
                    
           </Box>
         </Box>
            )}
        </ResponsiveContext.Consumer>
        </Grommet>
        </div>
    }
}

