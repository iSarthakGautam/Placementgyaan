const { createApp, ref } = Vue
  
const {createRouter,createWebHashHistory} = VueRouter




const Home = { 
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
                <div class="notification">Notification 1</div>
                <div class="notification">Notification 2</div>
                <div class="notification">Notification 3</div>
              </marquee>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="box assessment">
              <div class="box-image">
                <img src="../static/image/assesment.jpeg" alt="Assessment">
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

  
 }



const Jobs = { 
  template: `
  <h1 style="text-align:center;"> Jobs</h1><br> <br>
    <div class="filter-bar">
      <input id="filter-input" type="text" placeholder="Search by skills or location">
      <button id="filter-button">Filter</button>
    </div>

    <div class="job-cards">
      <!-- Example job card 1 -->
      <div class="job-card" data-skills="Skill 1, Skill 2" data-location="City">
        <h2>Job Title 1</h2>
        <p>Job Description 1...</p>
        <p>Skills: Skill 1, Skill 2</p>
        <p>Location: City, Country</p>
        <button class="more-info-button">More Info</button>
      </div>

      <!-- Example job card 2 -->
      <div class="job-card" data-skills="Skill 3, Skill 4" data-location="Town">
        <h2>Job Title 2</h2>
        <p>Job Description 2...</p>
        <p>Skills: Skill 3, Skill 4</p>
        <p>Location: Town, Country</p>
        <button class="more-info-button">More Info</button>
      </div>

      <!-- Add more job cards here -->

    </div>
  `,

  
 }



const Workshops = { 
  template: `

    <h1 style="text-align:center;"> Workshops</h1><br> <br>
  <div class="workshop-cards">
    <!-- Example workshop card 1 -->
    <div class="workshop-card">
      <h2>Workshop Title 1</h2>
      <p>Workshop Description 1...</p>
      <p>Date: June 1, 2023</p>
      <button class="more-info-button">More Info</button>
    </div>

    <!-- Example workshop card 2 -->
    <div class="workshop-card">
      <h2>Workshop Title 2</h2>
      <p>Workshop Description 2...</p>
      <p>Date: July 15, 2023</p>
      <button class="more-info-button">More Info</button>
    </div>

    <!-- Add more workshop cards here -->

  </div>


  `,
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
