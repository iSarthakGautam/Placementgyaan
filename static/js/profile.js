const { createApp, ref } = Vue
  
const {createRouter,createWebHashHistory} = VueRouter




const Home = { 
  data: function(){
      return {
        img_binary:"",
        Name:"",
        Age:"",
        linkedin_url:"",
        bio:"",
        old_pass:"",
        new_pass:"",
        confirm_pass:"",
        
        
      }
      },
    
  
  template: `
    <br><br>
    <table>
      <tr>
        <td>
          <h2>Personal Information</h2>
      
            <img src="../static/image/avatar.jpeg">

        <h4>Edit</h4>
        </td>
        
        
        <td>
        <input v-model="Name" type="text" placeholder="Name" required><br>
        
        <input v-model="Age" type="number" placeholder="Age" required><br>
        <input v-model="linkedin_url" type="text" placeholder="Linkedin Url" required>
        <button @click="profile_update_button">Update</button>
        </td>
        <td>
        <textarea   v-model="bio" id="w3review" name="w3review" rows="10" cols="50" placeholder="Bio..."></textarea>

        </td>
        
      </tr>
      
    </table><br>
    <hr>
    <h3> Change Password </h3>
    <table>
    <tr>
      <td> <input v-model="old_pass" type="password" placeholder="Old Password" required></td>
      <td> <input v-model="new_pass" type="password" placeholder="New Password" required></td>
      <td> <input v-model="confirm_pass" type="text" placeholder="Confirm Password" required></td>
      <td><button @click="student_password_update_button">Change</button></td>
    </tr>
    
    </table>
    
  `,
    created() {
    this.fetch_profile_data();
  },
    methods:  {
      async fetch_profile_data() {
      const jwtToken = localStorage.getItem('jwtToken');
      api_url="/api/profile/"+localStorage.getItem('email')
      if (jwtToken) {
        try {
          const response = await fetch(api_url, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${jwtToken}`,
            },
          });

          if (response.ok) {
            const profile_data = await response.json();
            data_array = profile_data.data;
            console.log(data_array)
            this.Name=data_array[0];
            this.Age=data_array[2];
            this.linkedin_url=data_array[1];
            this.bio=data_array[3]
            this.img_binary=data_array[4]
            
            
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
         else {
            console.log("Some Error")
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }

    },
      profile_update_button:  async function profile_update() {
        console.log(this.Age)
        
      const put_data = {
        image_binary: this.img_binary,
        name: this.Name,
        linked_in_url: this.linkedin_url,
        age: this.Age,
        bio: this.bio,        
      };
      

     try {
       
      api_url="/api/profile/"+localStorage.getItem('email')
       const jwtToken = localStorage.getItem('jwtToken');
        const response = await fetch(api_url, {
          method: 'PUT',
          headers: {
             'Content-Type': 'application/json',
              'Authorization': `Bearer ${jwtToken}`,
            },
          body: JSON.stringify(put_data),
        });
     
        if (response.status==200) {
          
          Swal.fire({
            icon: 'success',
            title: 'Update Successful',
            text: 'Reload if changes not visible'

          })
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Update Failed',

          })
        }
      } catch (error) {
        Swal.fire({
            icon: 'error',
          title: "Something went wrong"
          })
      }
      
    
    },
      student_password_update_button:  async function student_password_update() {
      
      if (this.confirm_pass!=this.new_pass){
        
        Swal.fire({
            icon: 'error',
            title: 'Confirm Password should match with new Password',

          })

        return
      }
      const put_data = {
        Password: this.old_pass,
        New_Password: this.new_pass,
        Email: localStorage.getItem('email'),       
      };
      

     try {
            
        api_url="/api/change_password"
       
       const jwtToken = localStorage.getItem('jwtToken');
        const response = await fetch(api_url, {
          method: 'PUT',
          headers: {
             'Content-Type': 'application/json',
              'Authorization': `Bearer ${jwtToken}`,
            },
          body: JSON.stringify(put_data),
        });
        
        if (response.status==200) {
          
          Swal.fire({
            icon: 'success',
            title: 'Password Updated Successfully',

          })
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Update Failed',

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





const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: Home },
    
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
