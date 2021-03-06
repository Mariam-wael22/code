import React from 'react'
import './date.css'
import '../globalstyle.css'

class Date extends React.Component{
    constructor(props){
        super(props)
        this.state={
            data:this.props.avilabledates,
            day:null,
            start:null,
            end:null,
            date:this.props.dateOfweek
        }
    }
    savedate=(event)=>{
        const {data,date,day,start,end}=this.state
        event.preventDefault();
        const dates={
            "start_time": `${start}`,
            "end_time": `${end}`,
            "day":`${day}`
        }
        if(this.props.isSetting){
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
                this.props.setState_Setting({activef:true})
                this.props.setState_Setting({activef:false})
              }
              })
          .catch((err) => {console.log(err)});
        }
        var joined = data.concat(dates);
        this.setState({ data: joined })
        const last =date.filter((arr)=>arr !==day)
        this.setState({date:last,day:last[0]})
    }
    handleChange = event => {
        const { value, name } = event.target;
        this.setState({ [name]: value });
      };
      deleteDate =(date1)=>{
          console.log(date1)
        if(this.props.isSetting){
            fetch(`https://diseasefighter.pythonanywhere.com/doctors/dates/${date1.id}`, {
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
              if(data.message==="You've deleted the date successfully"){
                this.props.setState_Setting({activef:true})
                this.props.setState_Setting({activef:false})
              }
              })
          .catch((err) => {console.log(err)});
        }
        else{
            const {data,date}=this.state
            var joined = date.concat(date1.day);
            const last = data.filter((arr)=>arr.day !==date1.day)
            this.setState({ data: last ,date:joined})
        }
        
      }
      chanagehour=(e)=>{
        const { value, name } = e.target;
        if(value.slice(0,2)/12 <1){
            if(value.slice(0,2)/12===0){
                 let date=12+value.slice(2)+' am'
                 this.setState({ [name]: date });
            }
            else{
                let date=value+' am'
                this.setState({ [name]: date });
            }
        }
        if(value.slice(0,2)/12 >=1){
            if(value.slice(0,2)/12===1){
                let date=12+value.slice(2)+' pm'
                this.setState({ [name]: date });
           }
            else{
                let divdate=value.slice(0,2)%12
                let date=divdate+value.slice(2)+' pm'
                this.setState({ [name]: date });
            }
        }
    }

    render(){
        const {data,date}=this.state
        console.log(data)
        console.log(date)
        return(
            <div>
                <form onSubmit={this.savedate}>
                    <div class="mb-1">
                        <label>Day</label>
                        <select name='day' class="form-control form-select shadow p-2 rounded" onChange={this.handleChange} required>
                            <option selected disabled value="">Select Day</option>
                            {date.map((day1)=>(
                                <option>{day1}</option>
                            ))}
                        </select>
                    </div>
                    <div className='mb-1'>
                        <label>Start Time</label>
                        <input type="time" name='start' className='form-control shadow p-2 rounded' onChange={this.chanagehour}  required/>
                    </div>
                    <div className='mb-1'>
                        <label>End Time</label>
                        <input type="time" name='end' className='form-control shadow p-2 rounded' onChange={this.chanagehour}  required/>
                    </div>
                    <div className='d-flex justify-content-center align-items-center'>
                        <button type='submit' className={`btn shadow p-2  rounded mt-2 mb-1 me-2 active-btn ${this.props.isSetting?('w-50'):('w-100')}`}>Add Avilable Date</button>
                    </div>
                    <div className='d-flex flex-column justify-content-center align-items-center mt-2 mb-3'>
                          {data?(
                              data.map((date1)=>(
                                <div className='dates'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-alarm-fill col-1" viewBox="0 0 16 16">
                                        <path d="M6 .5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1H9v1.07a7.001 7.001 0 0 1 3.274 12.474l.601.602a.5.5 0 0 1-.707.708l-.746-.746A6.97 6.97 0 0 1 8 16a6.97 6.97 0 0 1-3.422-.892l-.746.746a.5.5 0 0 1-.707-.708l.602-.602A7.001 7.001 0 0 1 7 2.07V1h-.5A.5.5 0 0 1 6 .5zm2.5 5a.5.5 0 0 0-1 0v3.362l-1.429 2.38a.5.5 0 1 0 .858.515l1.5-2.5A.5.5 0 0 0 8.5 9V5.5zM.86 5.387A2.5 2.5 0 1 1 4.387 1.86 8.035 8.035 0 0 0 .86 5.387zM11.613 1.86a2.5 2.5 0 1 1 3.527 3.527 8.035 8.035 0 0 0-3.527-3.527z"/>
                                    </svg>
                                    <p className='col-10'>{date1.day} ,{date1.start_time} - {date1.end_time} </p>
                                    <div className='icon' onClick={()=>this.deleteDate(date1)}>
                                        <i class="fa fa-times"></i>
                                    </div>
                                </div>
                            ))
                          ):(
                              null
                          )}
                      </div>
                      <div>
                          {data.length?(
                              <div className='d-flex justify-content-center align-items-center'>
                                  {this.props.isSetting?(
                                      null
                                  ):(
                                      <p className='btn shadow p-2 w-50 rounded mb-0 me-2 active-btn' onClick={()=>this.props.setState({send_date:data,avilabledates:data,dateOfweek:date,add_date:true,showdate:false})}>Done</p>
                                  )}
                                    
                              </div>
                          ):(null)}
                      </div>
                </form>
            </div>
        )
    }
}
export default Date