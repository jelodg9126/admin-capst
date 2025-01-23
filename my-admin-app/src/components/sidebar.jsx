import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { faGear } from '@fortawesome/free-solid-svg-icons'
import { Link, useLocation } from "react-router-dom";
import { Settings, UserPlus, Users, House, LogOut, Grid2x2, CircleEllipsis, History } from 'lucide-react'

function Sidebar(){

  function CustomLink({ href, children, className = "", ...props }) {
    const location = useLocation(); // Get current path
    const path = location.pathname.replace(/\/$/, ""); // Normalize path
    const linkHref = href.replace(/\/$/, ""); // Normalize href
  
    // Dynamically add "active" class
    const isActive = path === linkHref;
    const activeClass = isActive ? "active" : "";
  
    return (
        <Link to={href} className={`${className} ${activeClass}`} {...props}>
            {children}
        </Link>
    );
  }
  
return(
  <div className="sidebar-container">
    <div className="sidebar-pages">
      
     <div className="sidebar-logo">EasyQs.</div>
     <div className="sidebar-logo2">E</div>

       <div className="sidebar-pages1">

  
          <h3 className='sidebar-header1'>MAIN MENU</h3>

          <CustomLink className='sidebar-link' href ="/dashboard" >
          <House size={22} className='sidebar-icons' />
          <span className='sidebar-label'>Dashboard</span></CustomLink> 

   

        <CustomLink className='sidebar-link' href ="/users" >
        <Users size={22} className='sidebar-icons' />
        <span className='sidebar-label'> Users </span></CustomLink>

        <CustomLink className='sidebar-link' href ="/pqs" >
        <CircleEllipsis size={22} className='sidebar-icons' />
        <span className='sidebar-label'> Pending Queues </span></CustomLink>


        <CustomLink className='sidebar-link' href ="/acc" >
        <UserPlus size={22} className='sidebar-icons' />
        <span className='sidebar-label'> Add Account </span></CustomLink>

        <CustomLink className='sidebar-link' href ="/LogHis" >
        <History size={22} className='sidebar-icons' />
        <span className='sidebar-label'> Login History </span></CustomLink>

      </div>

        <div className="sidebar-pages2">  
          <h4 className="sidebar-header2">FINANCE WINDOW</h4> 
        
           <CustomLink className='sidebar-link' href="/win1" >
           <Grid2x2 size={22} className='sidebar-icons'/>
           <span className='sidebar-label'>Window 1 </span></CustomLink>

           <CustomLink className='sidebar-link' href="/win2" >
           <Grid2x2 size={22} className='sidebar-icons'/>
           <span className='sidebar-label'>Window 2 </span></CustomLink>

           <CustomLink  className='sidebar-link' href="/win3">
           <Grid2x2 size={22} className='sidebar-icons'/>
           <span className='sidebar-label'>Window 3</span></CustomLink>

        <div className="Config-Pages">
            <CustomLink className="sidebar-link" href ="/sts">
            <Settings size={22} className='sidebar-icons'/>
            <span className='sidebar-label'>Settings </span></CustomLink>
 
<<<<<<< Updated upstream
            <CustomLink className="sidebar-link" href="/" onClick={() => {
=======
            <CustomLink className="sidebar-link" href="/wins" nClick={() => {
>>>>>>> Stashed changes
            console.log("User logged out successfully");
            }}>
            <LogOut size={22} className="sidebar-icons" flip="horizontal" />
            <span className="sidebar-label">Log out</span>
            </CustomLink>
           </div>

<<<<<<< Updated upstream
            </div>
=======
>>>>>>> Stashed changes
        </div>
    </div>
   </div>
    
)
}

export default Sidebar

