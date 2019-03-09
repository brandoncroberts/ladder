import React from "React";
import axios from './axios';

import { Box, Button, Collapsible, Heading, Grommet, Layer, ResponsiveContext, Image, TextInput, Paragraph} from 'grommet';

import { FormClose, Notification, ContactInfo, AddCircle } from 'grommet-icons';

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


export class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.handleEditing = this.handleEditing.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.updateBio = this.updateBio.bind(this)
        this.state = {
            editing: false,
            biodraft: ""
        };
    }


updateBio(){
axios.post("/updatebio" ,{
    biodraft: this.state.biodraft
}).then(({data})=>{
    console.log("data!!", data)
    this.props.updateProfileBio(data.bio)
    this.setState(()=>{
        return {
            editing:false
            
        }
    })
})
}

    handleEditing(){
        this.setState(()=>{
            return {
                editing:true
                
            }
        })
        }

        handleChange(e){
            this.setState({biodraft: e.target.value})
        }   


    render() {
        return (
            <Grommet theme={theme}>
    

        
            <Box    direction='row'>  
            
            <h1>About Me:</h1>
            {this.props.bio ? (<Box border={{ color: 'brand', size: 'large' }} pad="medium" background="light-3"> <Paragraph>{this.props.bio}</Paragraph></Box>) : (<div>"No Bio Given Yet" <Button icon={<ContactInfo/>} label="Edit" onClick={this.handleEditing}/></div>)}
            {this.props.bio && <Button icon={<ContactInfo/>} label="Edit" onClick={this.handleEditing}/> }
            {this.state.editing && <div>
                <TextInput
                name="input" 
                placeholder="About Me"
                 onChange={this.handleChange}
                /> 
                
                </div>}
                {this.state.editing && <div>
                        
                      <Button  onClick={this.updateBio} icon={<AddCircle/> } label="Submit"/>
                    </div>}

                 </Box>
                    </Grommet>
        );
    }
}




