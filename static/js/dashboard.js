const { createApp, ref } = Vue
  
const {createRouter,createWebHashHistory} = VueRouter




const Home = { 
  data: function(){
      return {
        notifications:[]

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
                Assessment
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
  `,
    created() {
    this.fetchNotifications();
  },
    methods:  {
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
            swal.fire({
               icon: 'error',
            title: 'Can you relogin',

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
        jobs:[]

      }
      },
    
  template: `
  <h1 style="text-align:center;"> Jobs</h1><br> <br>
    <div class="filter-bar">
      <input id="filter-input" type="text" placeholder="Search by skills or location">
      <button id="filter-button">Filter</button>
    </div>

  


      <div v-for="(job, index) in jobs" :key="index" class="job-card" :data-skills="job[6]" :data-location="job[3]">
      <h2>{{ job[2] }}</h2>
      <p>{{ job[1] }}</p>
      <p>Skills: {{ job[6] }}</p>
      <p>Location: {{ job[3] }}</p>
      <button class="more-info-button" @click="showJobDetails(job)">More Info</button>
    </div>

  
     
    </div>

    </div>
  `,
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
            swal.fire({
               icon: 'error',
            title: 'Can you relogin',

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
          <p>Skills: ${job[6]}</p>
          <p>Location: ${job[3]}</p>
          <p>Min Salary: ${job[4]}</p>
          <p>Apply Link: ${job[5]}</p>
          <p>Min Qualification: ${job[7]}</p>
        `,
        icon: 'info',
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

    <h1 style="text-align:center;"> Workshops</h1><br> <br>
  <div class="workshop-cards">

    <div v-for="(workshop, index) in workshops" :key="index" class="workshop-card">
      <h2>{{ workshop[1] }}</h2>
      <p>{{ workshop[2] }}</p>
      <p>Date: {{ workshop[4] }}</p>
      <button class="more-info-button" @click="showWorkshopDetails(workshop)">More Info</button>
    </div>

    <!-- Add more workshop cards here -->

  </div>


  `,
created() {
    this.fetchJobs();
  },
    methods:  {
      async fetchJobs() {
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
            swal.fire({
               icon: 'error',
            title: 'Can you relogin',

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

const Experience = { 
  template: `


  <div class="experience-cards">
    <!-- Add Experience Card -->
    <div class="experience-card add-card">
      <div class="card-content">
        <i class="fas fa-plus"></i>
        <p>Add an experience</p>
      </div>
    </div>

    <!-- Experience Table Card -->
    <div class="experience-card table-card">
      <table>
        <thead>
          <tr>
            <th>Experience Title</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <!-- Example table rows -->
          <tr>
            <td>Job 1</td>
            <td>Worked as a software developer...</td>
          </tr>
          <tr>
            <td>Internship</td>
            <td>Completed a summer internship...</td>
          </tr>
          <!-- Add more rows as needed -->
        </tbody>
      </table>
    </div>
  </div>

  <!-- Your Experience Card -->
  <div class="experience-card your-experience-card">
    <h2>Your Experience</h2>
    <table>
      <thead>
        <tr>
          <th>Experience Title</th>
          <th>Description</th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <!-- Example table rows with edit and delete buttons -->
        <tr>
          <td>Job 1</td>
          <td>Worked as a software developer...</td>
          <td><button class="edit-button">Edit</button></td>
          <td><button class="delete-button">Delete</button></td>
        </tr>
        <tr>
          <td>Internship</td>
          <td>Completed a summer internship...</td>
          <td><button class="edit-button">Edit</button></td>
          <td><button class="delete-button">Delete</button></td>
        </tr>
        <!-- Add more rows as needed -->
      </tbody>
    </table>
  </div>


  `,

}
  



const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: Home },
    {path :'/jobs',component:Jobs},
    {path :'/workshop',component:Workshops},
    {path :'/experience',component:Experience},
    
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


document.addEventListener("DOMContentLoaded", function () {
  const filterInput = document.getElementById("filter-input");
  const filterButton = document.getElementById("filter-button");
  const jobCards = document.querySelectorAll(".job-card");

  filterButton.addEventListener("click", function () {
    const filterText = filterInput.value.toLowerCase();

    jobCards.forEach(function (card) {
      const skills = card.getAttribute("data-skills").toLowerCase();
      const location = card.getAttribute("data-location").toLowerCase();

      if (
        skills.includes(filterText) ||
        location.includes(filterText) ||
        filterText === ""
      ) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
});


function logout() {
  localStorage.removeItem('jwtToken');
  localStorage.removeItem('email');

  window.location.href = '/'; 
}
