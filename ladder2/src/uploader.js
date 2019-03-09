import React from "react"
import axios from './axios';

export default class Uploader extends React.Component{
    constructor(props){
        super(props)
this.uploadFile = this.uploadFile.bind(this)
        this.state={}
    }
    
    uploadFile(e) {
        e.preventDefault();
        var file = document.getElementById("file");
        // console.log("file", file.files);
        var uploadedFile = file.files[0];
        // console.log("uploadedFile", uploadedFile);
        var formData = new FormData();
        formData.append("file", uploadedFile);

        axios.post("/upload", formData).then(
          function(response) {
            console.log("response", response.data.url);
          this.props.updateProfileUrl(response.data.url)

          }.bind(this)
        );
          this.props.handleHideUploader()
      }



    render(  ){
        return(
            <div className="modalContainer">
            <div className="modal"> 
            <form>
            <input className="uploadInput" id = "file" type="file"/>
            <button className="uploadButton" onClick={this.uploadFile}>Submit</button>
            <button onClick={this.props.handleHideUploader}>Close</button>

            </form>
            <h1>Update Profile Picture</h1>

            </div>
            </div>
        )
    }
}

