const { createApp, ref } = Vue
  
const {createRouter,createWebHashHistory} = VueRouter




const Home = { 
  data: function(){
      return {
        notifications:[],
        notification_count:0,
        notificationScroll:2

      }
      },
    
  
  template: `
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
            <div class="box experiences">
              <div class="box-image">
                <img src="../static/image/exp.png" alt="Experiences">
              </div>
              <div class="box-text">
                <router-link to="experience" >Experience</router-link>
              </div>
            </div>
          </td>
          <td rowspan="2">
            <div class="notification-panel" @mouseover="stopNotification">
              <marquee onmouseover="this.stop();" onmouseout="this.start();" direction="up" behavior="scroll" :scrollamount="notificationScroll">
                   <div v-for="(notification, index) in notifications" :key="index" class="notification">
      <h3 @click="showNotificationBody(notification[0],notification[1])">{{ notification[0] }}</h3>
    </div>
              </marquee>
            </div>
          </td>
        </tr>
        <tr>
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
            <div class="box workshop">
              <div class="box-image">
                <img src="../static/image/workshop.png" alt="Workshop">
              </div>
              <div class="box-text">
                <router-link to="workshop">Workshops</router-link>
              </div>
            </div>
          </td>
        </tr>
      </table>

      <div  @click="showMessageModal()" class="floating-button">
  <img src="../static/image/contact_us.jpg" alt="Button Image">
</div>
  `,
    created() {
    this.fetchNotifications();
  },
    methods:  {
      showMessageModal() {
      Swal.fire({
        title: 'Report a Problem!',
        input: 'text',
        inputLabel: 'What technical issue are you facing?',
        inputPlaceholder: 'Type your message here...',
        showCancelButton: true,
        confirmButtonColor: '#36a3a3',
        confirmButtonText: 'Send',
        preConfirm: (message) => {
          this.postMessageToWebhook(message);
        }
      });
    },
    async postMessageToWebhook(message) {
      const webhookUrl = 'https://chat.googleapis.com/v1/spaces/AAAAFcPesEQ/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=evZFfvAqh5-Tcj8uwwPUWXBASDP5zYynzqvv21Owkac';
      const userEmail = localStorage.getItem('email');
      const formattedMessage = `User Email: ${userEmail}\nProblem: ${message}`;
      const postData = {
        text: formattedMessage
      };

      try {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(postData)
        });

        if (response.ok) {
          Swal.fire('Message Sent', 'Your message has been sent successfully! We will get back to you soon', 'success');
        } else {
          Swal.fire('Error', 'Failed to send message. Please try again later.', 'error');
        }
      } catch (error) {
        Swal.fire('Error', 'An error occurred while sending the message. Please try again later.', 'error');
      }
    },
      async fetchNotifications() {
      const jwtToken = localStorage.getItem('jwtToken');

      if (jwtToken) {
        try {
          const response = await fetch('/api/dashboard', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${jwtToken}`,
            },
          });

          if (response.ok) {
            const notificationsData = await response.json();
            this.notifications = notificationsData.Notification;
            console.log(notificationsData.Notification)
            if (notificationsData.Notification.length==0){
              this.notifications=[["No Notification","If persit then it might be error"]]
              console.log(this.notifications)
            }
            
          } 
            else if (response.status === 500) {
            Swal.fire({
              title: 'Session Timed out',
              text: "Please login again",
              icon: 'warning',
              showCancelButton: false,
              confirmButtonColor: '#36a3a3',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Ok'
            }).then((result) => {
              if (result.isConfirmed) {
                logout()
              }
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
      async showNotificationBody(title,body) {
      await Swal.fire({
        icon: 'info',
        title: title,
        html: body,
      });
    },
      setupNotificationInterval() {
      // Run the fetchNotifications function every 10 seconds
      setInterval(() => {
        this.fetchNotifications();
        this.checkForNewNotifications();
      }, 10000); // 10000 ms = 10 seconds
    },
    checkForNewNotifications() {
      const newNotificationCount = this.notifications.length - this.lastNotificationCount;
      if (newNotificationCount > 1) {
        Swal.fire({
          title: 'New Notifications',
          text: `You have ${newNotificationCount} new notifications.`,
          icon: 'info',
        });
        this.lastNotificationCount = this.notifications.length;
      }
    },
    }
}



const Jobs = { 
  data: function(){
      return {
        jobs:[],
        skillFilter: "",
      locationFilter: "",
      qualificationFilter: ""

      }
      },
    
  template: `

   
   

  
<table>
<tr style="text-align:center;"> <div>
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
      <div v-for="(job, index) in filteredJobs" :key="index" class="job-card" :data-skills="job[5]" :data-location="job[3]">
      <h2>{{ job[1] }}</h2>
      <p>{{ job[2] }}</p>
      <p>Skills: {{ job[5] }}</p>
      <p>Location: {{ job[3] }}</p>
      <button class="more-info-button" @click="showJobDetails(job)">More Info</button>
    </div>
    </tr>
</table

  
  
  `,
  computed: {
    filteredJobs() {
      const skillFilterLower = this.skillFilter.toLowerCase();
      const locationFilterLower = this.locationFilter.toLowerCase();
      const qualificationFilterLower = this.qualificationFilter.toLowerCase();
      
      // Convert qualification filter to lowercase if needed
      
      return this.jobs.filter(job => {
        const skillMatch = this.skillFilter === "" || job[5].toLowerCase().includes(skillFilterLower);
        const locationMatch = this.locationFilter === "" || job[3].toLowerCase().includes(locationFilterLower) || null;
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
              confirmButtonColor: '#36a3a3',
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
        title: job[1],
        html: `
          <p>${job[2]}</p>
          <p>Skills: ${job[5]}</p>
          <p>Location: ${job[3]}</p>
          <p>Min Salary: Rs.${job[4]} (CTC)</p>
          <p>Apply Link: <a href="${job[7]}">${job[7]}</a></p>
          <p>Min Qualification: ${job[6]}</p>
        `,
        icon: 'info',
        confirmButtonColor: '#36a3a3'
      });
    },
  
 }

}



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

    <div v-for="(workshop, index) in workshops" :key="index" class="workshop-card">
      <h2>{{ workshop[1] }}</h2>
      <p>{{ workshop[2] }}</p>
      <p>Mode : {{workshop[3]}}
      <p>Date: {{ workshop[5] }}</p>
      <p><a :href="'//'+workshop[4]" target="_blank"> Register</a></p>
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
              confirmButtonColor: '#36a3a3',
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
  
 }

}


const connect_page = { 
  data: function(){
      return {
        users:[]

      }
      },
    
  template: `
  <div class="workshop-cards"><br>
    <br>
    <div v-for="(user, index) in users" :key="index" class="workshop-card">
      <h2>{{ user[1] }}</h2>
      
      <p>{{ user[2] }}</p>
      <button class="more-info-button" @click="showConnectDetails(user)">More Info</button>
    </div>

    <!-- Add more workshop cards here -->

  </div>


  `,
created() {
    this.fetchConnections();
  },
    methods:  {
      async fetchConnections() {
      const jwtToken = localStorage.getItem('jwtToken');

      if (jwtToken) {
        try {
          const response = await fetch('/api/connect', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${jwtToken}`,
            },
          });

          if (response.ok) {
            const connectData = await response.json();
            this.users = connectData.users;
            console.log(connectData)
            
            if (connectData.users.length==0){
              console.log(this.users)
              swal.fire({
                icon: 'error',
               title: 'No Users Currently',

            })
              this.users=[]
            }
            
          } 
            else if (response.status === 500) {
            Swal.fire({
              title: 'Session Timed out',
              text: "Please login again",
              icon: 'warning',
              showCancelButton: false,
              confirmButtonColor: '#36a3a3',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Ok'
            }).then((result) => {
              if (result.isConfirmed) {
                logout()
              }
            })
            }
              else if (response.status === 404){
                 const connectData = await response.json();
            this.users = [];
            console.log(connectData)
               swal.fire({
                icon: 'error',
               title: 'No Users Currently',

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
      showConnectDetails(profile) {
      

      Swal.fire({
        title: profile[1],
        html: `
          <p>${profile[2]}</p>
          <img id="recreatedImage" alt="Recreated Image" width="300" height="300">
          <p>Linkedin: <a href="'/'+${profile[3]}">${profile[3]}</a></p>
        `,
        icon: 'info',
        confirmButtonColor: '#36a3a3',
      });
        if (profile[0] != null){
            const recreatedImage = document.getElementById('recreatedImage');
              const byteCharacters = profile[0].match(/.{1,2}/g);
              const byteArray = new Uint8Array(byteCharacters.map(byte => parseInt(byte, 16)));
              const blob = new Blob([byteArray], { type: 'image/jpeg' });
              const imageUrl = URL.createObjectURL(blob);
              
              recreatedImage.src = imageUrl;
            }
            else{
              
              recreatedImage.src="/static/image/avatar.jpeg";
            }
    },
  
 }

}


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
            <td>{{ test[1] }}</td>
            <td>{{ test[2] }}</td>
            <td>{{ test[4] }}</td>
            <td><button @click="give_test(test[3])" >Give</button></td>
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
      give_test(url){
        sessionStorage.setItem('test_url', url);
        window.location.href = '/dashboard#/assesment/test'
        
      },
    toggleFunction() {
       this.toggleState = !this.toggleState;
      console.log('Toggled: ', this.toggleState);
      if (this.toggleState) {
        console.log('Toggled ON');
        // Execute function when toggled ON
        window.location.href = '/dashboard#/pyq';
      } else {
        console.log('Toggled OFF');
        // Execute function when toggled OFF
        window.location.href = '/dashboard#/assesment';
      }
    }
  
 }

}



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
   <button class="normal-button" @click="add_test"> Add Paper </button>
   <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>File</th>
            <th>Action</th>
            
          </tr>
        </thead>
        <tbody>
          <tr v-for="(test, index) in tests" :key="index">
            <td>{{ test[1] }}</td>
            <td>{{ test[2] }}</td>
            <td><a :href="test[3]" target="_blank">PDF</a></td> 
            <td><div v-if="user_email == test[4]"><button class="delete-button" @click="delete_test(test[0])" >Delete</button></div><div v-else>
  ---
</div></td> 
            
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
  
    async delete_test_api_request(test_id) {
      const delete_data = {
        user_email: this.user_email,
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

      
    delete_test(test_id){
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
          this.delete_test_api_request(test_id);
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
        window.location.href = '/dashboard#/pyq';
      } else {
        console.log('Toggled OFF');
        // Execute function when toggled OFF
        window.location.href = '/dashboard#/assesment';
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
    <h2>Your Experience</h2>
    <table>
      <thead>
        <tr>
          <th>Experience Title</th>
          <th>Description</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>

        <tr v-for="(exp, index) in student_experiences" :key="index" >
        <template v-if="exp[4] == exp[4]">
            <td>{{exp[2]}}</td>
            <td v-if=" 'video' == exp[1]"> <a href="{{ exp[3] }}" target="_blank"> Click to watch video</td>
            <td v-else>{{ exp[3] }}</td>

            <td><button class="delete-button" @click="delete_my_exp(exp[0])">Delete</button> </td>

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
  <h2> Experiences</h2>
    <div class="experience-card table-card">
      <table>
        <thead>
          <tr>
            <th>title</th>
            <th>Description</th>
            <th> Posted by </th>
          </tr>
        </thead>
           <tr v-for="(exp, index) in admin_experiences" :key="index">
            <td>{{exp[[2]]}}</td>
            <td v-if=" 'video' == exp[1]"> <a href="{{ exp[3] }}" target="_blank"> Click to watch video</td>
            <td v-else>{{ exp[3] }}</td>
            <td> Admin</td>
          </tr>
          <tr v-for="(exp, index) in student_experiences" :key="index">
            <td>{{exp[[2]]}}</td>
            <td v-if=" 'video' == exp[1]"> <a href="{{ exp[3] }}" target="_blank"> Click to watch video</td>
            <td v-else>{{ exp[3] }}</td>
            <td> Student</td>
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
      email: localStorage.getItem("email"),
      experience_description: document.getElementById('experience_description').value
    };
  }
}).then((result) => {
  if (result.isConfirmed) {
    const jwtToken = localStorage.getItem('jwtToken');

    const postData = {
      experience_type: result.value.experience_type,
      experience_title: result.value.experience_title,
      email: result.value.email,
      experience_description: result.value.experience_description
    };

    fetch('/api/student/experiences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(postData)
    })
    .then(response => {
      if (response.status === 201) {
        Swal.fire({
              title: 'Experience Added Successfully',
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#36a3a3',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Ok'
            }).then((result) => {
              if (result.isConfirmed) {
                this.fetchStudentExperience();
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
             confirmButtonColor: '#36a3a3',
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
              confirmButtonColor: '#36a3a3',
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


const google_form_assesment = { 
  data: function(){
      return {
        test_url:sessionStorage.getItem('test_url'),
      }
      },
  template: `
  <br><br> <br><br> <br><br> <br><br>
    <iframe :src="test_url" width="100%" height="100%" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>

  `,
  created() {
    Swal.fire({
      icon:"info",
      title:"Important Information",
      text:"You Must login with same email in case of resetricted quiz as your profile email"
    })
  },

}


const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: Home },
    {path :'/jobs',component:Jobs},
    {path :'/workshop',component:Workshops},
    {path :'/experience',component:Experience},
    {path :'/connect',component:connect_page},
    {path :'/assesment', component:assesment},
    {path:'/assesment/test', component:google_form_assesment},
    
    {path :'/pyq', component:pyq_assesment},
    
  ]
});


const app = createApp({
  data() {
    return {
      greet: 'Hello, welcome to the login page!'
    };
  }
});


app.use(router)
app.mount("#app")



// Other js functions




function logout() {
  localStorage.removeItem('jwtToken');
  localStorage.removeItem('email');
  sessionStorage.removeItem('test_url');
  
  window.location.href = '/';
  window.location.href.reload();
}
