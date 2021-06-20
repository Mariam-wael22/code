
import React from 'react'
import {withRouter} from 'react-router-dom'
import '../../componant/globalstyle.css'
import './booking-info.css'
import bookingimg from '../../image/booking.png'
import dates from'./data'


class BookingInfo extends React.Component{
    constructor(props){
        super(props)
        this.state={
            dates:dates,
            day:'',
            time:'',
            name:'',
            gender:'',
            phone:'',
            medicines:'',
            comment:'',
            day_id:null,
            period_id:null,
            booking_success:false
        }
    }
    componentDidMount(){
        fetch(`https://thediseasefighter.herokuapp.com/doctors/${this.props.id}/dates`, {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem(
                "token"
            )}`,
              "Content-Type": "application/json",
          },
      })
          .then((res) => res.json())
          .then((data) => {
              console.log(data);
              this.setState({dates:data})
              })
          .catch((err) => {console.log(err)});
    }
    Booking=(event)=>{
        event.preventDefault();
        const {day,time,name,gender,phone,medicines,comment,period_id}=this.state
        var root=null
        var method=null
        var previous_period_id=period_id
        var data={
                    "day":day,
                    "time":time,
                    "am_pm":time.slice(-2),
                    "name":name,
                    "gender":gender,
                    "phone":phone,
                    "comment":comment,
                    "period_id":period_id,
                    "previous_period_id":previous_period_id,
                    error:''
        }
        if (this.props.location.state) {
            if(this.props.location.state.update){
                root=`https://thediseasefighter.herokuapp.com/sessions/${this.props.location.state.session_id}`
                method="PATCH"
                previous_period_id=this.props.location.state.period_id
                
            }
            else{
                root=`https://thediseasefighter.herokuapp.com/doctors/${this.props.id}/sessions`
                method="POST"
                data["medicines"]=medicines
            }
        }
        console.log(data)
        fetch(`${root}`, {
                    method: `${method}`,
                    body:JSON.stringify(data),
                    headers: {
                        Authorization: `Bearer ${window.localStorage.getItem(
                            "token"
                        )}`,
                        "Content-Type": "application/json",
                    },
                })
                    .then((res) => res.json())
                    .then((data) => {
                        this.setState({booking_success:true})
                        if(data.success){
                            this.setState({error:'Reservation Was Successful'})
                        }
                        else{
                            this.setState({error:'Reservation Was Failed'})
                            alert('Reservation Was Failed')
                            this.setState({booking_success:false})
                        }
                        
                    })
                    .catch((err) => console.log(err));
    }
     delete_appoint=()=>{
        fetch(`https://thediseasefighter.herokuapp.com/sessions/${this.props.location.state.session_id}`, {
         method: "DELETE",
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
             this.props.history.push('/home')
             })
         .catch((err) => {console.log(err)});
    }
    availableDates={}
    render(){
        return(
            <div className='booking-info'>
                {!this.state.booking_success?(
                    this.state.dates.dates?(
                        <div>
                        <div className='booking-header d-flex flex-column justify-content-center align-items-center'>
                            <h3>Booking Information</h3>
                            <p>fill your contact details</p>
                        </div>
                        <form onSubmit={this.Booking}>
                        <div class="mb-1">
                            <label>Date</label>
                            <select name='date' class="form-control form-select shadow p-2 rounded" onChange={(e)=>{
                                const dayId = e.target.selectedIndex
                                this.setState({day_id:e.target[dayId].attributes['data-id'].value})
                                this.setState({day:e.target.value})
                            }} required>
                            <option selected disabled value="">Select the day</option>
                            {this.state.dates.dates.map((date) => {
                                this.availableDates[date.id] = { ...date.available_dates }
                                return(<option data-id={date.id} name={date.day}>{date.day}</option> )
                            })}
                            </select>
                        </div>
                        <div class="mb-1">
                            <label>Time</label>
                            <select name='time' class="form-control form-select shadow p-2 rounded" onChange={(e)=>{
                                    const period_id = e.target.selectedIndex
                                    this.setState({period_id:e.target[period_id].attributes['data-id'].value})
                                    this.setState({time:e.target.value})
                                }} required>
                                <option value='none' selected disabled hidden>Select the time</option>:
                                {this.availableDates?(this.state.day_id?(
                                    Object.values(this.availableDates[this.state.day_id]).map((date)=>(
                                        !date.is_available?(
                                            <option data-id={date.id} name={date.time}>{date.time}</option>
                                        ):(console.log(false))
                                ))
                                ):(null)):(null)}
                            </select>
                        </div>
                        <div class="mb-1">
                            <label>Name</label>
                            <input type="text" name='name' class="form-control shadow p-2 rounded" onChange={(e)=>{this.setState({name:e.target.value})}} required/>
                         </div>
                        <div className='phone-gender d-flex'>
                            <div class="gender mb-1 me-2">
                                <label>Gender</label>
                                <select name='gender'  class="form-control form-select shadow p-2 rounded" onChange={(e)=>{this.setState({gender:e.target.value})}} required>
                                    <option selected disabled value="">Select Gender</option>
                                    <option >Male</option>
                                    <option >Female</option>
                                </select>
                            </div>
                            <div class="mb-1">
                                <label>Phone Number</label>
                                <input type="number"  name='phone' class="form-control shadow p-2 rounded" onChange={(e)=>{this.setState({phone:e.target.value})}} required/>
                            </div>
                        </div>
                        {!this.props.location.state.update?(
                            <div class="mb-1">
                                <label>Medicines</label>
                                <textarea type='text' class="form-control shadow p-2 rounded" onChange={(e)=>{this.setState({medicines:e.target.value})}} />
                            </div>
                        ):(null)}
                        <div class="mb-1">
                        <label>Comment</label>
                        <textarea class="form-control shadow p-2 rounded" onChange={(e)=>{this.setState({comment:e.target.value})}} />
                        </div>
                            <div className='mt-3 d-flex justify-content-center align-items-center'>
                            {this.props.location.state.update?(
                                <button className='btn delete danger shadow p-2 w-50 rounded' onClick={this.delete_appoint}>Delete</button>
                        ):(null)}
                            <button type='submit' className='btn active shadow p-2 w-50 rounded'>Book Appointment</button>
                            </div>
                            </form>
                            </div>
                    ):(null)          
                ):(
                    <div>
                        <img src={bookingimg} alt='booking image'/>
                            <div className='booking-header'>
                            <h3>{this.state.error}</h3>
                        </div>
                    </div>
                )}
                
                
            </div>
        )
    }
    
}
export default withRouter(BookingInfo);