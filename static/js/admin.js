//////////// IMPORTS ////////////////
const { createApp, ref } = Vue
  
const {createRouter,createWebHashHistory} = VueRouter

/////////////////////////////////////


const Home = { 
  data: function(){
      return {
        any_data:"This is random data",

      }
      },
    
  
  template: `
  <div><h3>Hi Admin...</h3>
  <br>
  <div>
      <table>
        <tr>
          <td>
            <div class="box jobs">
              <div class="box-image">
                <img src="../static/image/jobs.png" alt="Jobs">
              </div>
              <div class="box-text">
                <router-link to="jobs" >Jobs</router-link>
              </div>
            </div>
          </td>
          <td>
            <div class="box workshop">
              <div class="box-image">
                <img src="../static/image/workshop.png" alt="Workshop">
              </div>
              <div class="box-text">
                <router-link to="workshop">Workshops</router-link>
              </div>
            </div>
          </td>
       
          <td>
            <div class="box assessment">
              <div class="box-image">
                <img src="../static/image/assesment.jpeg" alt="Assessment" >
              </div>
              <div class="box-text">
                <router-link to="assesment" >Assesments</router-link>
              </div>
            </div>
          </td>
          
          <td>
            <div class="box experiences">
              <div class="box-image">
                <img src="../static/image/exp.png" alt="Experiences">
              </div>
              <div class="box-text">
                <router-link to="experience" >Experience</router-link>
              </div>
            </div>
          </td>
          
          
        </tr>
      </table>
    </div>
    </div>
  `,
    created() {
    this.any_function_name();   // to call method when page is loaded
  },
    methods:  {
      async any_function_name() {
      const jwtToken = localStorage.getItem('jwtToken');  // to fetch JWT token 

      
    },
    }
}

// Jobs component
const Jobs = { 
  data: function(){
      return {
        jobs:[],
        skillFilter: "",
      locationFilter: "",
      qualificationFilter: ""

      }
      },
    
  template: `  <div>
<table>
<tr> <div>
      <h1>Job</h1>  
      <br>
      <div>
    <div class="filters">
      <input
        v-model="skillFilter"
        class="filter-input"
        placeholder="Skill"
      >
      <input
        v-model="locationFilter"
        class="filter-input"
        placeholder="Location"
      >
      <input
        v-model="qualificationFilter"
        class="filter-input"
        placeholder="Qualification"
      >
     
    </div>
    <!-- Rest of the template -->
  </div>
    <br>
    </div>
    </tr>
    
    <tr>
    <div class="job-cards">
    <button class="more-info-button" @click="add_job(job)">ADD JOB</button>
    
      <div v-for="(job, index) in filteredJobs" :key="index" class="job-card" :data-skills="job[5]" :data-location="job[3]">
      <h2>{{ job[1] }}</h2>
      <p>{{ job[2] }}</p>
      <p>Skills: {{ job[5] }}</p>
      <p>Location: {{ job[3] }}</p>
      <button class="more-info-button" @click="edit_job(job, index)">Edit</button>
      <button class="delete-button" @click="delete_job(job[0])">Delete</button>
    </div>
    </tr>
</table>
</div>`,
  computed: {
    filteredJobs() {
      const skillFilterLower = this.skillFilter.toLowerCase();
      const locationFilterLower = this.locationFilter.toLowerCase();
      const qualificationFilterLower = this.qualificationFilter.toLowerCase();
      
      // Convert qualification filter to lowercase if needed
      
      return this.jobs.filter(job => {
        const skillMatch = this.skillFilter === "" || job[5].toLowerCase().includes(skillFilterLower);
        const locationMatch = this.locationFilter === "" || job[3].toLowerCase().includes(locationFilterLower)|| one;
        // You can add a similar condition for qualification if needed
        const qualificationMatch = this.qualificationFilter === "" || job[6].toLowerCase().includes(qualificationFilterLower);
        
        return skillMatch && locationMatch && qualificationMatch;
      });
    }
  },
created() {
    this.fetchJobs();
  
  },
    methods:  {
      async fetchJobs() {
      const jwtToken = localStorage.getItem('jwtToken');

      if (jwtToken) {
        try {
          const response = await fetch('/api/admin/jobs', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${jwtToken}`,
            },
          });

          if (response.ok) {
            const jobData = await response.json();
            this.jobs = jobData.jobs;
            console.log(jobData)
            if (jobData.jobs.length==0){
              console.log(this.jobs)
              swal.fire({
                icon: 'error',
               title: 'No Jobs Currently',

            })
              this.jobs=[]
            }
            
          } 
            else if (response.status === 500) {
            Swal.fire({
              title: 'Session Timed out',
              text: "Please login again",
              icon: 'warning',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Ok'
            }).then((result) => {
              if (result.isConfirmed) {
                logout()
              }
            })
            }
              else if (response.status === 404){
                 const jobData = await response.json();
            this.jobs = [];
            console.log(jobData)
               swal.fire({
                icon: 'error',
               title: 'No Jobs Currently',

            })
              }
          
         else {
            console.log("Some Error")
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }

    },
      showJobDetails(job) {
      // Use SweetAlert2 to show more job details
      Swal.fire({
        title: job[2],
        html: `
          <p>${job[1]}</p>
          <p>Skills: ${job[5]}</p>
          <p>Location: ${job[3]}</p>
          <p>Min Salary: ${job[4]}</p>
          <p>Apply Link: ${job[7]}</p>
          <p>Min Qualification: ${job[6]}</p>
        `,
        icon: 'info',
      });
    },

    // Adding a new Job
      add_job(job){
      Swal.fire({
  title: 'Add a Job',
  html: `

    <input id="job_title" class="swal2-input" placeholder="Job Title">
    <input id="job_description" class="swal2-input" placeholder="Description">
    <input id="min_salary" class="swal2-input" placeholder="Salary">
    <input id="job_location" class="swal2-input" placeholder="Location">
    <input id="apply_link" class="swal2-input" placeholder="Link">
    <input id="skills_required" class="swal2-input" placeholder="Skills">
    <input id="min_qualification" class="swal2-input" placeholder="Qualification">

  `,
  focusConfirm: false,
  confirmButtonColor: '#36a3a3',
  preConfirm: () => {
    return {
      job_title: document.getElementById('job_title').value,
      job_description: document.getElementById('job_description').value,
      min_salary: document.getElementById('min_salary').value,
      job_location: document.getElementById('job_location').value,
      apply_link: document.getElementById('apply_link').value,
      skills_required: document.getElementById('skills_required').value,
      min_qualification: document.getElementById('min_qualification').value,
      
      // user_email: localStorage.getItem('email'),
    };
  }
}).then((result) => {
  if (result.isConfirmed) {
    const postData = {
      job_title: result.value.job_title,
      job_description: result.value.job_description,
      min_salary: result.value.min_salary,
      job_location: result.value.job_location,
      apply_link: result.value.apply_link,
      skills_required: result.value.skills_required,
      min_qualification: result.value.min_qualification,
      // user_email: result.value.user_email
    };
    
    const jwtToken = localStorage.getItem('jwtToken');
    fetch('/api/admin/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(postData)
    })
    .then(response => {
      if (response.status === 201) {
        this.fetchJobs();
        Swal.fire({
              title: 'Job Added Successfully',
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#36a3a3',
              confirmButtonText: 'Ok'
            })
      } 
      else if((response.status === 200)){
        Swal.fire({
          title:"Job Already Their",
          text:"Recheck Drive Link",
          icon:"info",
          confirmButtonColor: '#36a3a3',
        })
      }
      else {
        Swal.fire({
          title:"Something Went Wrong",
          text:"Try Again",
          icon:"error",
          confirmButtonColor: '#36a3a3',
        })
      }
    })
    .catch(error => {
      console.error("Request failed:", error);
    });
  }
});

    },

    // Deleting Job
    async delete_job_api_request(job_id) {
      const delete_data = {
        // user_email: this.user_email,
        job_id:job_id,
      };
      
        api_url="/api/admin/jobs";
        const jwtToken = localStorage.getItem('jwtToken');
        await fetch(api_url, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(delete_data),
        }).then((response) => response.json()).then((data) => {

          
          if (data.message=="Job deleted successfully"){
             this.fetchJobs();
          Swal.fire({
              title: 'Job Deleted Successfully',
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#36a3a3',
              confirmButtonText: 'Ok'
            })
            
          
          
          }
          else{
            Swal.fire({
              title: 'Something Went Wrong',
              text:'Try Again',
              icon: 'error',
              confirmButtonColor: '#36a3a3'
              
            })
          }
        })
      .catch(console.error);
          return
    },

      
    delete_job(job_id){
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#36a3a3',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.delete_job_api_request(job_id);
        }
      })
      
    },

  edit_job(job,index){
   
      Swal.fire({
  title: 'Edit Job',
  html: `

    <input id="job_title" class="swal2-input" value='${job[1]}'>
    <input id="job_description" class="swal2-input" value='${job[2]}'>
    <input id="min_salary" class="swal2-input" value='${job[4]}'>
    <input id="job_location" class="swal2-input" value='${job[3]}'>
    <input id="apply_link" class="swal2-input" value='${job[7]}'>
    <input id="skills_required" class="swal2-input" value='${job[5]}'>
    <input id="min_qualification" class="swal2-input" value='${job[6]}'>

  `,
  focusConfirm: false,
  confirmButtonColor: '#36a3a3',
  preConfirm: () => {
    return {
      job_title: document.getElementById('job_title').value,
      job_description: document.getElementById('job_description').value,
      min_salary: document.getElementById('min_salary').value,
      job_location: document.getElementById('job_location').value,
      apply_link: document.getElementById('apply_link').value,
      skills_required: document.getElementById('skills_required').value,
      min_qualification: document.getElementById('min_qualification').value,
      
      // user_email: localStorage.getItem('email'),
    };
  }
}).then((result) => {
  if (result.isConfirmed) {
    const postData = {
      job_id:job[0],
      job_title: result.value.job_title,
      job_description: result.value.job_description,
      min_salary: result.value.min_salary,
      job_location: result.value.job_location,
      apply_link: result.value.apply_link,
      skills_required: result.value.skills_required,
      min_qualification: result.value.min_qualification,
      // user_email: result.value.user_email
    };
    
    const jwtToken = localStorage.getItem('jwtToken');
    fetch('/api/admin/jobs', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(postData)
    })
    .then(response => {
      if (response.status === 200) {
        this.fetchJobs();
        Swal.fire({
              title: 'Job Edited Successfully',
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#36a3a3',
              confirmButtonText: 'Ok'
            })
      } 

      else {
        Swal.fire({
          title:"Something Went Wrong",
          text:"Try Again",
          icon:"error",
          confirmButtonColor: '#36a3a3',
        })
      }
    })
    .catch(error => {
      console.error("Request failed:", error);
    });
  }
});
 
  },
  
 }
  

}
// Job component ends


// workshop component.
const Workshops = { 
  data: function(){
      return {
        workshops:[]

      }
      },
    
  template: `

    <table>
    <tr style="text-align:center;">
    <h1>Workshop</h1>
    </tr>
    <tr>
    
  <div class="workshop-cards">
    <button class="more-info-button" @click="add_workshop(job)">Add Workshop</button>
    <div v-for="(workshop, index) in workshops" :key="index" class="workshop-card">
      <h2>{{ workshop[1] }}</h2>
      <p>{{ workshop[2] }}</p>
      <p>Mode: {{ workshop[3] }}</p>
      <p>Date: {{ workshop[5] }}</p>
      <p><a :href="workshop[4]" target="_blank"> Register</a></p>
      <button class="more-info-button" @click="edit_workshop(workshop, index)">Edit</button>
      <button class="delete-button" @click="delete_workshop(workshop[0])">Delete</button>
    </div>

    <!-- Add more workshop cards here -->

  </div>
  </tr>


  `,
created() {
    this.fetchWorkshops();
  },
    methods:  {
      async fetchWorkshops() {
      const jwtToken = localStorage.getItem('jwtToken');

      if (jwtToken) {
        try {
          const response = await fetch('/api/admin/workshop', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${jwtToken}`,
            },
          });

          if (response.ok) {
            const workshopData = await response.json();
            this.workshops = workshopData.workshops;
            console.log(workshopData)
            if (workshopData.workshops.length==0){
              console.log(this.workshops)
              swal.fire({
                icon: 'error',
               title: 'No Workshops Currently',

            })
              this.workshops=[]
            }
            
          } 
            else if (response.status === 500) {
            Swal.fire({
              title: 'Session Timed out',
              text: "Please login again",
              icon: 'warning',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Ok'
            }).then((result) => {
              if (result.isConfirmed) {
                logout()
              }
            })
            }
              else if (response.status === 404){
                 const workshopData = await response.json();
            this.workshops = [];
            console.log(workshopData)
               swal.fire({
                icon: 'error',
               title: 'No Workshops Currently',

            })
              }
          
         else {
            console.log("Some Error")
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }

    },
      showWorkshopDetails(workshop) {
      Swal.fire({
        title: workshop[1],
        html: `
          <p>${workshop[2]}</p>
          <p>Date: ${workshop[4]}</p>
          <p>Registration Link: ${workshop[3]}</p>
        `,
        icon: 'info',
      });
    },
      add_workshop(workshop){
      Swal.fire({
  title: 'Add a Workshop',
  html: `

    <input id="workshop_title" class="swal2-input" placeholder="Workshop Title">
    <input id="workshop_description" class="swal2-input" placeholder="Description">
    <input id="workshop_mode_location" class="swal2-input" placeholder="Mode">
    <input id="workshop_registration_link" class="swal2-input" placeholder="Link">
    <input id="workshop_date" class="swal2-input" placeholder="Date">

  `,
  focusConfirm: false,
  confirmButtonColor: '#36a3a3',
  preConfirm: () => {
    return {
      workshop_title: document.getElementById('workshop_title').value,
      workshop_description: document.getElementById('workshop_description').value,
      workshop_mode_location: document.getElementById('workshop_mode_location').value,
      workshop_registration_link: document.getElementById('workshop_registration_link').value,
      workshop_date: document.getElementById('workshop_date').value
      
      // user_email: localStorage.getItem('email'),
    };
  }
}).then((result) => {
  if (result.isConfirmed) {
    const postData = {
      workshop_title: result.value.workshop_title,
      workshop_description: result.value.workshop_description,
      workshop_mode_location: result.value.workshop_mode_location,
      workshop_registration_link: result.value.workshop_registration_link,
      workshop_date: result.value.workshop_date,
    
      // user_email: result.value.user_email
    };
    
    const jwtToken = localStorage.getItem('jwtToken');
    fetch('/api/admin/workshop', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(postData)
    })
    .then(response => {
      if (response.status === 201) {
        this.fetchWorkshops();
        Swal.fire({
              title: 'Wrokshop added Successfully',
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#36a3a3',
              confirmButtonText: 'Ok'
            })
      } 
      else if((response.status === 200)){
        Swal.fire({
          title:"Workshop Already Their",
          text:"Recheck Drive Link",
          icon:"info",
          confirmButtonColor: '#36a3a3',
        })
      }
      else {
        Swal.fire({
          title:"Something Went Wrong",
          text:"Try Again",
          icon:"error",
          confirmButtonColor: '#36a3a3',
        })
      }
    })
    .catch(error => {
      console.error("Request failed:", error);
    });
  }
});

    },
      // Deleting Workshop
    async delete_workshop_api_request(workshop_id) {
      const delete_data = {
        // user_email: this.user_email,
        workshop_id:workshop_id,
      };
      
        api_url="/api/admin/workshop";
        const jwtToken = localStorage.getItem('jwtToken');
        await fetch(api_url, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(delete_data),
        }).then((response) => response.json()).then((data) => {

          
          if (data.message=="Workshop deleted successfully"){
             this.fetchWorkshops();
          Swal.fire({
              title: 'Workshop Deleted Successfully',
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#36a3a3',
              confirmButtonText: 'Ok'
            })
            
          
          
          }
          else{
            Swal.fire({
              title: 'Something Went Wrong',
              text:'Try Again',
              icon: 'error',
              confirmButtonColor: '#36a3a3'
              
            })
          }
        })
      .catch(console.error);
          return
    },
      delete_workshop(workshop_id){
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#36a3a3',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.delete_workshop_api_request(workshop_id);
        }
      })
      
    },
    // Edit Workshop
        edit_workshop(workshop,index){
   
      Swal.fire({
  title: 'Edit Workshop',
  html: `

    <input id="workshop_title" class="swal2-input" value='${workshop[1]}'>
    <input id="workshop_description" class="swal2-input" value='${workshop[2]}'>
    <input id="workshop_mode_location" class="swal2-input" value='${workshop[3]}'>
    <input id="workshop_registration_link" class="swal2-input" value='${workshop[4]}'>
    <input id="workshop_date" class="swal2-input" value='${workshop[5]}'>

  `,
  focusConfirm: false,
  confirmButtonColor: '#36a3a3',
  preConfirm: () => {
    return {
      workshop_title: document.getElementById('workshop_title').value,
      workshop_description: document.getElementById('workshop_description').value,
      workshop_mode_location: document.getElementById('workshop_mode_location').value,
      workshop_registration_link: document.getElementById('workshop_registration_link').value,
      workshop_date: document.getElementById('workshop_date').value,
      
      // user_email: localStorage.getItem('email'),
    };
  }
}).then((result) => {
  if (result.isConfirmed) {
    const postData = {
      workshop_id:workshop[0],
      workshop_title: result.value.workshop_title,
      workshop_description: result.value.workshop_description,
      workshop_mode_location: result.value.workshop_mode_location,
      workshop_registration_link: result.value.workshop_registration_link,
      workshop_date: result.value.workshop_date,
      // user_email: result.value.user_email
    };
    
    const jwtToken = localStorage.getItem('jwtToken');
    fetch('/api/admin/workshop', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(postData)
    })
    .then(response => {
      if (response.status === 200) {
        this.fetchWorkshops();
        Swal.fire({
              title: 'Workshop Edited Successfully',
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#36a3a3',
              confirmButtonText: 'Ok'
            })
      } 

      else {
        Swal.fire({
          title:"Something Went Wrong",
          text:"Try Again",
          icon:"error",
          confirmButtonColor: '#36a3a3',
        })
      }
    })
    .catch(error => {
      console.error("Request failed:", error);
    });
  }
});
 
  },
  
 }

}
// workshop component ends

// Assements component
const assesment = { 
  data: function(){
      return {
        tests:[],
        toggleState: false

      }
      },
    
  template: `
  <div style="text-align:center;">
  
  <div class="toggle-container">
    <span class="toggle-label"><h1> &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp Mock tests</h1> </span>
    <div class="toggle-switch" @click="toggleFunction" :class="{ 'on': toggleState }">
      <div class="toggle-switch-bg"></div> 
    </div><h1>&nbsp Student Test</h1>
  </div>
  <button class="more-info-button" @click="add_assesment(assesment)">Add Assesment</button>

   <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Deadline</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(test, index) in tests" :key="index">
            <td>{{ test[3] }}</td>
            <td>{{ test[1] }}</td>
            <td>{{ test[5] }}</td>
            <td><button class="more-info-button" @click="edit_assesment(test,index)">Edit</button><button class="delete-button" @click="delete_assesment(test[0])">Delete</button></td>
          </tr>
        
        </tbody>
      </table>
    </div>
    
  </div>


  `,
created() {
    this.fetchMocktests();
  },
    methods:  {
      
      async fetchMocktests() {
      const jwtToken = localStorage.getItem('jwtToken');
      if (jwtToken) {
        try {
          const response = await fetch('/api/admin/test', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${jwtToken}`,
            },
          });

          if (response.ok) {
            const assesmentData = await response.json();
            this.tests= assesmentData.tests;
            if (assesmentData.users.length==0){
              console.log(this.tests)
              swal.fire({
                icon: 'error',
               title: 'No Mock Tests Currently',

            })
              this.tests=[]
              
            }
            
          } 
            else if (response.status === 500) {
            Swal.fire({
              title: 'Session Timed out',
              text: "Please login again",
              icon: 'warning',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Ok'
            }).then((result) => {
              if (result.isConfirmed) {
                logout()
              }
            })
            }
              else if (response.status === 404){
                 const assesmentData = await response.json();
            this.users = [];
            console.log(assesmentData)
               swal.fire({
                icon: 'error',
               title: 'No test Currently',

            })
              }
          
         else {
            console.log("Some Error")
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }

    },
      
    toggleFunction() {
       this.toggleState = !this.toggleState;
      console.log('Toggled: ', this.toggleState);
      if (this.toggleState) {
        console.log('Toggled ON');
        // Execute function when toggled ON
        console.log("hello")
        window.location.href = '/admin_dashboard#/pyq';
      } else {
        console.log('Toggled OFF');
        // Execute function when toggled OFF
        window.location.href = '/admin_dashboard#/assesment';
      }
    },

      // Add assesment
      add_assesment(assesment){
      Swal.fire({
  title: 'Add a Assement',
  html: `

    <input id="assesment_type" class="swal2-input" placeholder="Assesment Type">
    <input id="assesment_name" class="swal2-input" placeholder="Assesmnt Name">
    <input id="assesment_link" class="swal2-input" placeholder="Link">
    <input id="deadline" class="swal2-input" placeholder="Deadline">
    <input id="time_limit_seconds" class="swal2-input" placeholder="Duration">

  `,
  focusConfirm: false,
  confirmButtonColor: '#36a3a3',
  preConfirm: () => {
    return {
      assesment_type: document.getElementById('assesment_type').value,
      assesment_name: document.getElementById('assesment_name').value,
      assesment_link: document.getElementById('assesment_link').value,
      deadline: document.getElementById('deadline').value,
      time_limit_seconds: document.getElementById('time_limit_seconds').value,
      
      // user_email: localStorage.getItem('email'),
    };
  }
}).then((result) => {
  if (result.isConfirmed) {
    const postData = {
      assesment_type: result.value.assesment_type,
      assesment_name: result.value.assesment_name,
      assesment_link: result.value.assesment_link,
      deadline: result.value.deadline,
      time_limit_seconds: result.value.time_limit_seconds,
    
      // user_email: result.value.user_email
    };
    
    const jwtToken = localStorage.getItem('jwtToken');
    fetch('/api/admin/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(postData)
    })
    .then(response => {
      if (response.status === 201) {
        this.fetchMocktests();
        Swal.fire({
              title: 'Assesment added Successfully',
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#36a3a3',
              confirmButtonText: 'Ok'
            })
      } 
      else if((response.status === 200)){
        Swal.fire({
          title:"Assesment Already Their",
          text:"Recheck Drive Link",
          icon:"info",
          confirmButtonColor: '#36a3a3',
        })
      }
      else {
        Swal.fire({
          title:"Something Went Wrong",
          text:"Try Again",
          icon:"error",
          confirmButtonColor: '#36a3a3',
        })
      }
    })
    .catch(error => {
      console.error("Request failed:", error);
    });
  }
});

    },
    // Deleting Assesment
    async delete_assesment_api_request(assesment_id) {
      const delete_data = {
        // user_email: this.user_email,
        assesment_id:assesment_id,
      };
      
        api_url="/api/admin/test";
        const jwtToken = localStorage.getItem('jwtToken');
        await fetch(api_url, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(delete_data),
        }).then((response) => response.json()).then((data) => {

          
          if (data.message=="Test deleted successfully"){
             this.fetchMocktests();
          Swal.fire({
              title: 'Test Deleted Successfully',
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#36a3a3',
              confirmButtonText: 'Ok'
            })
  
          
          }
          else{
            Swal.fire({
              title: 'Something Went Wrong',
              text:'Try Again',
              icon: 'error',
              confirmButtonColor: '#36a3a3'
              
            })
          }
        })
      .catch(console.error);
          return
    },
      delete_assesment(assesment_id){
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#36a3a3',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.delete_assesment_api_request(assesment_id);
        }
      })
      
    },
      // Edit Assement
        edit_assesment(assesment,index){
   
      Swal.fire({
  title: 'Edit Assesment',
  html: `

    <input id="assesment_type" class="swal2-input" value='${assesment[1]}'>
    <input id="assesment_name" class="swal2-input" value='${assesment[3]}'>
    <input id="assesment_link" class="swal2-input" value='${assesment[4]}'>
    <input id="deadline" class="swal2-input" value='${assesment[5]}'>
    <input id="time_limit_seconds" class="swal2-input" value='${assesment[6]}'>

  `,
  focusConfirm: false,
  confirmButtonColor: '#36a3a3',
  preConfirm: () => {
    return {
      assesment_type: document.getElementById('assesment_type').value,
      assesment_name: document.getElementById('assesment_name').value,
      assesment_link: document.getElementById('assesment_link').value,
      deadline: document.getElementById('deadline').value,
      time_limit_seconds: document.getElementById('time_limit_seconds').value,
      
      // user_email: localStorage.getItem('email'),
    };
  }
}).then((result) => {
  if (result.isConfirmed) {
    const postData = {
      assesment_id: assesment[0],
      assesment_type: result.value.assesment_type,
      assesment_name: result.value.assesment_name,
      assesment_link: result.value.assesment_link,
      deadline: result.value.deadline,
      time_limit_seconds: result.value.time_limit_seconds,
      // user_email: result.value.user_email
    };
    
    const jwtToken = localStorage.getItem('jwtToken');
    fetch('/api/admin/test', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(postData)
    })
    .then(response => {
      if (response.status === 200) {
        this.fetchMocktests();
        Swal.fire({
              title: 'Assement Edited Successfully',
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#36a3a3',
              confirmButtonText: 'Ok'
            })
      } 

      else {
        Swal.fire({
          title:"Something Went Wrong",
          text:"Try Again",
          icon:"error",
          confirmButtonColor: '#36a3a3',
        })
      }
    })
    .catch(error => {
      console.error("Request failed:", error);
    });
  }
});
 
  },
  
 }

}
// Assements component Ends



const pyq_assesment = { 
  data: function(){
      return {
        tests:[],
        toggleState: true,
        user_email: localStorage.getItem('email'),
        

      }
      },
    
  template: `
  <div style="text-align:center;">
  
  <div class="toggle-container">
    <span class="toggle-label"><h1>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp Mock tests</h1> </span>
    <div class="toggle-switch" @click="toggleFunction" :class="{ 'on': toggleState }">
      <div class="toggle-switch-bg"></div> 
    </div><h1>&nbsp Student Test</h1>
  </div>
   
   <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>File</th>
            <th>Posted by</th>
            <th>Action</th>
            
          </tr>
        </thead>
        <tbody>
          <tr v-for="(test, index) in tests" :key="index">
            <td>{{ test[1] }}</td>
            <td>{{ test[2] }}</td>
            <td><a :href="test[3]" target="_blank">PDF</a></td> 
            <td>{{test[4]}}</td>
            
            <td><button class="delete-button" @click="delete_test(test[0],test[4])" >Delete</button></div></td> 
            
          </tr>
        
        </tbody>
      </table>
    </div>
    
  </div>


  `,
created() {
    this.fetchMocktests();
  },
    methods:  {
      
      async fetchMocktests() {
      const jwtToken = localStorage.getItem('jwtToken');
      if (jwtToken) {
        try {
          const response = await fetch('/api/student/past_test', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${jwtToken}`,
            },
          });

          if (response.ok) {
            const assesmentData = await response.json();
            this.tests= assesmentData.tests;
            console.log(assesmentData)
            if (assesmentData.users.length==0){
              console.log(this.tests)
              swal.fire({
                icon: 'error',
               title: 'No Mock Tests Currently',

            })
              this.tests=[]
              
            }
            
          } 
            else if (response.status === 500) {
            Swal.fire({
              title: 'Session Timed out',
              text: "Please login again",
              icon: 'warning',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Ok'
            }).then((result) => {
              if (result.isConfirmed) {
                logout()
              }
            })
            }
              else if (response.status === 404){
                 const assesmentData = await response.json();
            this.users = [];
            console.log(assesmentData)
               swal.fire({
                icon: 'error',
               title: 'No test Currently',

            })
              }
          
         else {
            console.log("Some Error")
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }

    },
  
    async delete_test_api_request(test_id,student_email) {
      const delete_data = {
        user_email: student_email,
        test_id:test_id,
      };
      
        api_url="/api/student/past_test";
        const jwtToken = localStorage.getItem('jwtToken');
        await fetch(api_url, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(delete_data),
        }).then((response) => response.json()).then((data) => {

          
          if (data.message=="Test deleted successfully"){
             this.fetchMocktests();
          Swal.fire({
              title: 'Test Deleted Successfully',
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#36a3a3',
              confirmButtonText: 'Ok'
            })
            
          
          
          }
          else{
            Swal.fire({
              title: 'Something Went Wrong',
              text:'Try Again',
              icon: 'error',
              confirmButtonColor: '#36a3a3'
              
            })
          }
        })
      .catch(console.error);
          return
    },

      
    delete_test(test_id,student_email){
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#36a3a3',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.delete_test_api_request(test_id,student_email);
        }
      })
      
    },

    add_test(){
      Swal.fire({
  title: 'Submit Paper Details',
  html: `

    <input id="paper_name" class="swal2-input" placeholder="Paper Name">
    <input id="paper_description" class="swal2-input" placeholder="Paper Description">
    <input id="paper_pdf_link" class="swal2-input" placeholder="Paper PDF Link">

  `,
  focusConfirm: false,
  confirmButtonColor: '#36a3a3',
  preConfirm: () => {
    return {
      paper_name: document.getElementById('paper_name').value,
      paper_description: document.getElementById('paper_description').value,
      paper_pdf_link: document.getElementById('paper_pdf_link').value,
      user_email: localStorage.getItem('email'),
    };
  }
}).then((result) => {
  if (result.isConfirmed) {
    const postData = {
      paper_name: result.value.paper_name,
      paper_description: result.value.paper_description,
      paper_pdf_link: result.value.paper_pdf_link,
      user_email: result.value.user_email
    };
    
    const jwtToken = localStorage.getItem('jwtToken');
    fetch('/api/student/past_test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(postData)
    })
    .then(response => {
      if (response.status === 201) {
        this.fetchMocktests();
        Swal.fire({
              title: 'Test Added Successfully',
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#36a3a3',
              confirmButtonText: 'Ok'
            })
      } 
      else if((response.status === 200)){
        Swal.fire({
          title:"Test Already Their",
          text:"Recheck Drive Link",
          icon:"info",
          confirmButtonColor: '#36a3a3',
        })
      }
      else {
        Swal.fire({
          title:"Something Went Wrong",
          text:"Try Again",
          icon:"error",
          confirmButtonColor: '#36a3a3',
        })
      }
    })
    .catch(error => {
      console.error("Request failed:", error);
    });
  }
});

    },

    toggleFunction() {
       this.toggleState = !this.toggleState;
      console.log('Toggled: ', this.toggleState);
      if (this.toggleState) {
        console.log('Toggled ON');
        // Execute function when toggled ON
        window.location.href = '/admin_dashboard#/pyq';
      } else {
        console.log('Toggled OFF');
        // Execute function when toggled OFF
        window.location.href = '/admin_dashboard#/assesment';
      }
    }
  
 }

}

const Experience = { 
   data: function(){
      return {
        student_experiences:[],
        admin_experiences: [],
        user_email: localStorage.getItem('email'),
        

      }
      },
    
  template: `

<table>
<tr><br><br><br><br><br><br><h1>&nbsp</h1><br>
</tr>
<tr>
  <td style="vertical-align: center;">
  <div class="experience-cards">
    <!-- Add Experience Card -->
    <div class="experience-card add-card">
      <div class="card-content">
        <i class="fas fa-plus"></i>
        <p @click="add_exp()">Add </p>
      </div>
    </div>
  </td>
  <td colspan=3> 
  <!-- Your Experience Card -->
  <div class="experience-card your-experience-card">
    <h2>Admin Experience</h2>
    <table>
      <thead>
        <tr>
          <th>Experience Title</th>
          <th>Description</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>

        <tr v-for="(exp, index) in admin_experiences" :key="index" >
        <template v-if="exp[4] == exp[4]">
            <td>{{exp[2]}}</td>
            <td v-if=" 'video' == exp[1]"> <a href="{{ exp[3] }}" target="_blank"> Click to watch video</td>
            <td v-else>{{ exp[3] }}</td>

            <td><button class="delete-button" @click="delete_admin_exp(exp[0])">Delete</button>
            <button class="more-info-button" @click="edit_admin_exp(exp)">Edit</button></td>

      </template>
          </tr>

      </tbody>
    </table>
  </div>
    
  </td>
  </tr>
  <tr>
  <td colspan=4>
  <!-- Experience Table Card -->
  <h2> Student Experiences</h2>
    <div class="experience-card table-card">
      <table>
        <thead>
          <tr>
            <th>title</th>
            <th>Description</th>
            <th> Posted by </th>
            <th> Action </th>
          </tr>
        </thead>
        
          <tr v-for="(exp, index) in student_experiences" :key="index">
            <td>{{exp[[2]]}}</td>
            <td v-if=" 'video' == exp[1]"> <a href="{{ exp[3] }}" target="_blank"> Click to watch video</td>
            <td v-else>{{ exp[3] }}</td>
            <td> {{ exp[4] }}</td>
            <td><button class="delete-button" @click="delete_my_exp(exp[0])">Delete</button> </td>
          </tr>
          


      </table>
    </div>
  </div>
  
  </td>
</tr>
</table>


  `,
  created() {
    this.fetchAdminExperience();
    this.fetchStudentExperience();
  },
    methods:  {
      // deleting student experience starts
      async delete_exp_api_request(exp_id) {
      const delete_data = {
        user_email: this.user_email,
        experience_id:exp_id,
      };
      
        api_url="/api/student/experiences";
        const jwtToken = localStorage.getItem('jwtToken');
        await fetch(api_url, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(delete_data),
        }).then((response) => response.json()).then((data) => {

          
          if (data.message=="Experience deleted"){
             this.fetchStudentExperience();
          Swal.fire({
              title: 'Test Deleted Successfully',
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#36a3a3',
              confirmButtonText: 'Ok'
            })
            
          
          
          }
          else{
            Swal.fire({
              title: 'Something Went Wrong',
              text:'Try Again',
              icon: 'error',
              confirmButtonColor: '#36a3a3'
              
            })
          }
        })
      .catch(console.error);
          return
    },
      delete_my_exp(exp_id){
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#36a3a3',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.delete_exp_api_request(exp_id);
        }
      })
      
    },
      // deleting student experiencee ends

      // Deleting admin experience starts
      async delete_admin_exp_api_request(exp_id) {
      const delete_data = {
        // user_email: this.user_email,
        experience_id:exp_id,
      };
      
        api_url="/api/admin/experience";
        const jwtToken = localStorage.getItem('jwtToken');
        await fetch(api_url, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(delete_data),
        }).then((response) => response.json()).then((data) => {

          
          if (data.message=="Experience deleted"){
             this.fetchAdminExperience();
          Swal.fire({
              title: 'Experience Deleted Successfully',
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#36a3a3',
              confirmButtonText: 'Ok'
            })
            
          
          
          }
          else{
            Swal.fire({
              title: 'Something Went Wrong',
              text:'Try Again',
              icon: 'error',
              confirmButtonColor: '#36a3a3'
              
            })
          }
        })
      .catch(console.error);
          return
    },
      delete_admin_exp(exp_id){
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#36a3a3',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.delete_admin_exp_api_request(exp_id);
        }
      })
      
    },
      // Deleting admin eperience ends

      // Adding Admin experience
      add_exp(){
 Swal.fire({
  title: 'Submit Experience Details',
  html: `
    <p><strong>Note: All Fields are compulsory</strong></p>
    <select id="experience_type" class="swal2-input" required>
      <option value="blog">Blog</option>
      <option value="video">Video</option>
    </select>
    <input id="experience_title" class="swal2-input" placeholder="Experience Title" required>
    <input id="experience_description" class="swal2-input" placeholder="Experience Description" required>
  `,
  focusConfirm: false,
  preConfirm: () => {
    return {
      experience_type: document.getElementById('experience_type').value,
      experience_title: document.getElementById('experience_title').value,
      experience_description: document.getElementById('experience_description').value
    };
  }
}).then((result) => {
  if (result.isConfirmed) {
    const jwtToken = localStorage.getItem('jwtToken');

    const postData = {
      experience_type: result.value.experience_type,
      experience_title: result.value.experience_title,
      experience_description: result.value.experience_description
    };

    fetch('/api/admin/experience', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(postData)
    })
    .then(response => {
      if (response.status === 200) {
        this.fetchAdminExperience()
        Swal.fire({
              title: 'Experience Added Successfully',
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Ok'
            }).then((result) => {
              if (result.isConfirmed) {
                this.fetchAdminExperience();
              }
            })
      } else {
        console.log("Error");
      }
    })
    .catch(error => {
      console.error("Request failed:", error);
    });
  }
});


},
      // Adding admin exp ends

      // Edit admin exp
      edit_admin_exp(exp){
   
      Swal.fire({
  title: 'Edit Experience',
  html: `
    <p><strong>Note: All Fields are compulsory</strong></p>
    <select id="experience_type" class="swal2-input" required >
      <option value="blog">Blog</option>
      <option value="video">Video</option>
    </select>
    <input id="experience_title" class="swal2-input" placeholder="Experience Title" value='${exp[2]}' required>
    <input id="experience_description" class="swal2-input" placeholder="Experience Description" value='${exp[3]}' required>
  

  `,
  focusConfirm: false,
  confirmButtonColor: '#36a3a3',
  preConfirm: () => {
    return {
      experience_type: document.getElementById('experience_type').value,
      experience_title: document.getElementById('experience_title').value,
      experience_description: document.getElementById('experience_description').value,
      
    };
  }
}).then((result) => {
  if (result.isConfirmed) {
    const postData = {
      experience_id: exp[0],
      experience_type: result.value.experience_type,
      experience_title: result.value.experience_title,
      experience_description: result.value.experience_description,
    };
    
    const jwtToken = localStorage.getItem('jwtToken');
    fetch('/api/admin/experience', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(postData)
    })
    .then(response => {
      if (response.status === 200) {
        this.fetchAdminExperience();
        Swal.fire({
              title: 'Expereince Update Successfully',
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#36a3a3',
              confirmButtonText: 'Ok'
            })
      } 

      else {
        Swal.fire({
          title:"Something Went Wrong",
          text:"Try Again",
          icon:"error",
          confirmButtonColor: '#36a3a3',
        })
      }
    })
    .catch(error => {
      console.error("Request failed:", error);
    });
  }
});
 
  },
      // Edit admin exp ends

      
      async fetchAdminExperience(){
        const jwtToken = localStorage.getItem('jwtToken');
      if (jwtToken) {
        try {
          const response = await fetch('/api/admin/experience', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${jwtToken}`,
            },
          });

          if (response.ok) {
            const expData = await response.json();
            this.admin_experiences= expData.Experiences;
          }
          else {
            console.log("Some Error")
          }
          if (response.status === 500) {
            Swal.fire({
              title: 'Session Timed out',
              text: "Please login again",
              icon: 'warning',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Ok'
            }).then((result) => {
              if (result.isConfirmed) {
                logout()
              }
            })
            }
    
          
         
        } catch (error) {
          console.error('Error:', error);
        }
      }
        
      },

      async fetchStudentExperience(){
        const jwtToken = localStorage.getItem('jwtToken');
        if (jwtToken) {
        try {
          const response = await fetch('/api/student/experiences', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${jwtToken}`,
            },
          });

          if (response.ok) {
            const expData = await response.json();
            console.log(expData)
            this.student_experiences= expData.Experiences;
          }
          else {
            console.log("Some Error")
          }
            if (response.status === 500) {
            Swal.fire({
              title: 'Session Timed out',
              text: "Please login again",
              icon: 'warning',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Ok'
            }).then((result) => {
              if (result.isConfirmed) {
                logout()
              }
            })
            }
    
          
         
        } catch (error) {
          console.error('Error:', error);
        }
      }
        
      },
       
        
}     
  
  

}





const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/workshop', component: Workshops},
    { path: '/jobs', component: Jobs},
    { path: '/assesment', component: assesment},
    { path: '/pyq', component: pyq_assesment},
    { path: '/pyq', component: pyq_assesment},
    { path: '/experience', component: Experience},
    
  
  ]
});


const app = createApp({
  data() {
    return {
      greet: 'Hello, welcome to the Admin page!'  // just to setup vue
    };
  }
});


app.use(router)
app.mount("#app")




/*

Setup Vue here

*/



// General Functions

function logout(){
  localStorage.removeItem('jwtToken');
  window.location.href = '/';
}

function change_password(){
  Swal.fire({
  title: 'Change Password',
  html: `
    <input type="password" id="old_password" class="swal2-input" placeholder="Old Password" required>
    <input type="password" id="new_password" class="swal2-input" placeholder="New Password" required>
    <input type="password" id="confirm_password" class="swal2-input" placeholder="Confirm New Password" required>
  `,
  focusConfirm: false,
  confirmButtonColor: '#3085d6',
  preConfirm: () => {
    return {
      old_password: document.getElementById('old_password').value,
      new_password: document.getElementById('new_password').value,
      confirm_password: document.getElementById('confirm_password').value
    };
  }
}).then((result) => {
  if (result.isConfirmed) {
    if (result.value.new_password === result.value.confirm_password) {
      const postData = {
        Password: result.value.old_password,
        New_Password: result.value.new_password
      };
      const jwtToken = localStorage.getItem('jwtToken');
      fetch('/api/admin/change_password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(postData)
      })
      .then(response => {
        if (response.status === 200) {
          Swal.fire({
            title:'Password Changed', 
            text:'Your password has been successfully changed.', 
            icon: 'success',
            confirmButtonColor: '#3085d6',
          });
        } else {
          Swal.fire({
            title:'Password Change Failed',
            text:'Old Password is incorrect', 
            icon: 'error',
            confirmButtonColor: '#3085d6'
          });
        }
      })
      .catch(error => {
        console.error("Request failed:", error);
        Swal.fire({
          title:'Password Change Failed',
          text:'An error occurred while changing your password.', 
          icon: 'error',
          confirmButtonColor: '#3085d6'
        });
      });
    } else {
      Swal.fire({
        title:'Password Mismatch', 
        text:'New password and confirm password do not match.', 
        icon:'error',
        confirmButtonColor: '#3085d6'
      });
    }
  }
});

}