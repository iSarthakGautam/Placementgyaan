const { createApp, ref } = Vue
  
const {createRouter,createWebHashHistory} = VueRouter
localStorage.removeItem('jwtToken');
localStorage.removeItem('email');




const Login = { 
  data: function(){
    return {
      Email:"",
      Password:"",
    }
  },
  template: `
  <h1>Hi Student<br>Login</h1>
     
      <form>
        <input v-model="Email" type="email" placeholder="Email" required>
        <input v-model="Password" type="password" placeholder="Password" required>
        <button @click="login_button" >Login</button>
      </form>
      <br>
      <router-link to="signup">sign up</router-link>
      <br><br><br><br>
      <p style="text-align:right;"><router-link to="admin" >Admin</a></p>
  `,
  methods:{
    login_button:  async function submitlogin() {

      const login_data = {
        Email: this.Email,
        Password: this.Password,
        
      };
      if (this.Email==="" || this.Password===""){
        Swal.fire({
            icon: 'error',
            title: "Email and password can't be empty"
    
          })
        return
      }
      
     
        base_url=window.location.href.split("/")[0]+"//"+window.location.href.split("/")[2]
        api_url=base_url+"/api/login"
  
        await fetch(api_url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(login_data),
        }).then((response) => response.json()).then((data) => {
          console.log(data)
          if (data.message=="Login Failed" || data.message=="No user exisit in database"){
            
            Swal.fire({
            icon: 'error',
            title: "Login Failed"
    
          })
            return "Error"
          }
          if (data.access_token!=""){
          localStorage.setItem('jwtToken', data.access_token);
          localStorage.setItem('email', this.Email)
          redirectUrl = base_url+"/dashboard"
          window.location.href = redirectUrl;
          }
        })
          
    }
  }

}

const Signup={
  data: function(){
    return {
      Name:"",
      Email:"",
      Password:"",
      roll_no:"",
      confirm_password:""
      
    }
  },
  template: `

  <h1>Hi Student<br>Sign Up</h1>
     
      <form>
        <input v-model="Name" type="text" placeholder="Name" required>
        <input v-model="roll_no" type="text" placeholder="Roll Number" required>
        <input v-model="Email" type="email" placeholder="Email" required>
        <input v-model="Password" type="password" placeholder="Password" required>
        <input v-model="confirm_password " type="password" placeholder="Confirm Password" required>
        <button @click="signup_button">Signup</button>
      </form>
      <br>
      <router-link to="/">Back to Login</router-link>
      
  `,
  methods:{
    signup_button:  async function submitSignUp() {
      if (this.Password != this.confirm_password) {
        Swal.fire({
            icon: 'error',
            title: 'Confirm Password should be same as Password',

          })
        return;
      }
      const signup_data = {
        Name: this.Name,
        Email: this.Email,
        Password: this.Password,
        roll_no: this.roll_no
        
      };
      

     try {
        base_url=window.location.href.split("/")[0]+"//"+window.location.href.split("/")[2]
        api_url=base_url+"/api/signup"
       
        const response = await fetch(api_url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(signup_data),
        });
        
        if (response.status==201) {
          
          Swal.fire({
              title: 'Sign Up Successful',
              text: "Please login ",
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Ok'
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.href = '/';
              }
            })
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Sign-up failed',

          })
        }
      } catch (error) {
        Swal.fire({
            icon: 'error',
          title: "Something went wrong"
          })
      }
      
    
    }
  }

}

const Admin = { 
  data: function(){
    return {
      Password:"",
    }
  },
  template: `
  <h1>Hi Admin<br>Login</h1>
     
      <form>
        <input  v-model="Password" type="password" placeholder="Password" required>
        <button @click="login_button">Login</button>
      </form>
      <br>
      <br><br><br><br>
      <p style="text-align:right;"><router-link to="/" >Student</router-link></p>
  `,
  
  methods:{
    login_button:  async function submitlogin() {

      const login_data = {

        Password: this.Password,
        
      };
      
     
        base_url=window.location.href.split("/")[0]+"//"+window.location.href.split("/")[2]
        api_url=base_url+"/api/admin_login"
  
        await fetch(api_url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(login_data),
        }).then((response) => response.json()).then((data) => {

          if (data.message=="Login failed"){
            
            Swal.fire({
            icon: 'error',
            title: "Login Failed"
    
          })
            return "Error"
          }
          if (data.message=="Login Success"){
          localStorage.setItem('jwtToken', data.access_token);
          redirectUrl = base_url+"/admin_dashboard"
          window.location.href = redirectUrl;
          }
        })
      .catch(console.error);
    
    }
  }


  
 }

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: Login },
    { path: '/signup', component: Signup },
    { path: '/admin', component: Admin },
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