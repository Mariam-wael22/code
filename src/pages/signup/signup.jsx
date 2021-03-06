import React from 'react'
import { Link ,withRouter} from 'react-router-dom'
import Logo from '../../image/logo.png'
import '../../componant/globalstyle.css'
import './signup.css'
import Date from '../../componant/date/date'

class Signup extends React.Component{
    constructor(){
        super()
        this.state={
            is_doctor:false,
            account_info:false,
            error:'',
            name:null,
            email:null,
            password:null,
            confirm_password:null,
            location:'',
            phone:'',
            gender:null,
            specialist:null,
            specialist_name:null,
            specializations:null,
            about:'',
            add_date:true,
            showdate:false,
            send_date:null,
            avilabledates:[],
            dateOfweek:['Saturday','Sunday','Monday','Tuesday','Wednesday','Thursday','Friday']
        }
    }
    componentDidMount(){
        fetch("https://diseasefighter.pythonanywhere.com/specializations", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                    .then((res) => res.json())
                    .then((data) => {
                        console.log(data)
                        this.setState({specializations:data.specializations})
                        
                    })
                    .catch((err) => console.log(err));
    }

    AddDates=(dates)=>{
      fetch("https://diseasefighter.pythonanywhere.com/doctors/dates", {
          method: "POST",
          body: JSON.stringify(dates),
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem(
                "token"
            )}`,
              "Content-Type": "application/json",
          },
      })
          .then((res) => res.json())
          .then((data) => {
              console.log(data)
              if(data.message==="You have created a new date"){

              }
              })
          .catch((err) => {console.log(err)});
     }


    check_email =(event)=>{ 
        event.preventDefault();
        const {email}=this.state;
        const data={'email':email};
        console.log(data);
        fetch("https://diseasefighter.pythonanywhere.com/email", {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
              "Content-Type": "application/json",
          },
      })
          .then((res) => res.json())
          .then((data) => {
              console.log(data);
              if(data.message==="Email Not Found!"){
                  this.setState({account_info:true,error:data.message})
              }
              else{
                this.setState({error:data.message})
              }
              })
          .catch((err) => {console.log(err)});
       }
       create_account =(event)=>{ 
        event.preventDefault();
        const {is_doctor,send_date,add_date,name,email,password,about,location,phone,gender,specialist}=this.state
        const data={'Check_email':true,'name':name,'email':email,'password':password, 'is_doctor':is_doctor,'location':location,'clinic_location':location,'phone':phone,'gender':gender, 'spec_id':specialist , 'about':about};
        console.log(data);
        const AddDates=this.AddDates
        if(add_date){
            fetch("https://diseasefighter.pythonanywhere.com/register", {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
              "Content-Type": "application/json",
          },
      })
          .then((res) => res.json())
          .then((data) => {
              console.log(data);
              if(data.access_token){
                window.localStorage.setItem('token',data.access_token)
                if(data.is_doctor===true){
                    window.localStorage.setItem('doctor',true)
                    send_date.map((dates)=>(
                        AddDates(dates)
                    ))
                  }
                  this.props.history.push('/home')
                
              }
              else{
                this.setState({error:data.message})
              }
              })
          .catch((err) => {console.log(err)});
        }
        else{
            alert('please add avilable date')
        }

       }
       handleChange = event => {
        const { value, name } = event.target;
    
        this.setState({ [name]: value });
      }
    render(){
        const {is_doctor,specialist_name,avilabledates,dateOfweek,showdate,account_info,name,email,password,confirm_password,error,about,location,phone,gender}=this.state
        return(
            <div className='login'>
                <div className='background-login'>
                </div>
                <div className='login-container signup'>
                    <div className='logo'>
                        <Link to='/'>
                        <img src={Logo} alt="" />
                        </Link>
                    </div>
                    <div className='login-content position-relative'>
                    
                    {!account_info?(
                        <div>
                        <div className='d-flex mt-3'>
                            <p className={`btn shadow p-2 w-50 rounded me-2 ${is_doctor?(null):('active')}`} onClick={()=>this.setState({is_doctor:false})}>
                            <i className='fa fa-user-md'></i>Patient</p>
                            <p className={`btn shadow p-2 w-50 rounded me-2 ${is_doctor?('active'):(null)}`} onClick={()=>this.setState({is_doctor:true,add_date:false})}>
                            <i className='fa fa-user-md'></i>Doctor</p>
                        </div>
                        <form onSubmit={this.check_email}>
                        <div class="mb-2">
                            <label className='mb-1'>Name</label>
                            <input type="text" name='name' value={name} class="form-control shadow p-2 rounded" onChange={this.handleChange} required/>
                         </div>
                        <div class="mb-2">
                            <label className='mb-1'>Email address</label>
                            <input type="email" name='email' value={email} class="form-control shadow p-2 rounded" onChange={this.handleChange} required/>
                        </div>
                        <div class="mb-2">
                            <label className='mb-1'>Password</label>
                            <input type="password" name='password' value={password} class="form-control shadow p-2 rounded" onChange={this.handleChange} required/>
                        </div>
                        <div class="mb-3">
                            <label className='mb-1'>Confirm Password</label>
                            <input type="password" name='confirm_password' value={confirm_password} class="form-control shadow p-2 rounded" onChange={this.handleChange} required/>
                        </div>
                        <div>
                        <button type='submit' className='btn shadow p-2 w-100 rounded me-2 active'>Next</button>
                        </div>
                        <div>
                            <p class="text-danger">{error}</p>
                        </div>
                        </form>
                        <div className='d-flex justify-content-center'>
                            <label>have an account?</label>
                            <Link to='/login' className='signup-link'>SIGN In</Link>
                        </div>
                        <div className='d-flex justify-content-center go-next-container'>
                                <div className={`go-next shadow me-2 ${account_info?(null):('active')}`} onClick={()=>this.setState({account_info:false})}></div>
                                <div className={`go-next shadow me-2 ${account_info?('active'):(null)}`} ></div>
                            </div>
                        </div>
                    ):(
                        <div>{!showdate?(
                            <div>
                                <h2>You're Almost Done!</h2>
                            <form onSubmit={this.create_account}>
                            <div class="mb-1">
                                <label>About</label>
                                <input type="text" value={about} name='about' class="form-control shadow p-2 rounded" onChange={this.handleChange} required/>
                            </div>
                            <div class="mb-1">
                                <label>Location</label>
                                <input type="text" name='location' value={location} class="form-control shadow p-2 rounded" onChange={this.handleChange} required/>
                            </div>
                            <div class="mb-1">
                                <label>Phone Number</label>
                                <input type="number" value={phone} name='phone' class="form-control shadow p-2 rounded" onChange={this.handleChange} required/>
                            </div>
                            <div class="mb-1">
                                <label>Gender</label>
                                <select name='gender' value={gender} class="form-control form-select shadow p-2 rounded" onChange={this.handleChange} required>
                                        <option selected disabled value="">Select Gender</option>
                                         <option >Male</option>
                                         <option >Female</option>
                                    </select>
                            </div>
                            {is_doctor?(
                                <div>
                                <div class="mb-1">
                                <label>Specialist</label>
                                <select value={specialist_name} class="form-control form-select shadow p-2 rounded" onChange={(e)=>{
                                        const specId = e.target.selectedIndex
                                        this.setState({specialist:e.target[specId].attributes['data-id'].value,specialist_name:e.target.value})
                                    }} required>
                                    <option selected disabled value="">Select the specialization</option>
                                    {this.state.specializations.map((date) => {
                                        return(<option data-id={date.id} name={date.name}>{date.name}</option> )
                                    })}
                                </select>
                            </div>
                            <div>
                            <p className='btn shadow p-2 w-100 rounded mt-2 mb-0 me-2 active'onClick={()=>this.setState({add_date:false,showdate:true})}>Add Avilable Date</p>
                            </div>
                                </div>
                            ):(null)}

                            <div>
                                 <button type='submit' className='btn shadow p-2 w-100 rounded mt-2 mb-0 me-2 active'>Done</button>
                            </div>
                            <div className='d-flex justify-content-center go-next-container'>
                                <div className={`go-next shadow me-2 ${account_info?(null):('active')}`} onClick={()=>this.setState({account_info:false})}></div>
                                <div className={`go-next shadow me-2 ${account_info?('active'):(null)}`} ></div>
                            </div>
                            </form>
                            </div>
                        ):(<Date setState={state => this.setState(state)} dateOfweek={dateOfweek} avilabledates={avilabledates}/>)}
                            
                        </div>
                    )}
                        
                    </div>
                </div>
            </div>
        )
    }
}
export default withRouter(Signup);