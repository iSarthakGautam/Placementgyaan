


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
            text:'An error occurred while changing your password.', 
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