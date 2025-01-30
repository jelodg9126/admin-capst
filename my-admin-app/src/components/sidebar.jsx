import { Link, useLocation } from "react-router-dom";
import { Settings, UserPlus, Users, House, LogOut, Grid2x2, CircleEllipsis, History, MessageSquareText } from 'lucide-react'

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
      
     <div className="sidebar-logo">EasyQ's.</div>
     <div className="sidebar-logo2">E</div>

       <div className="sidebar-pages1">

  
          <h3 className='sidebar-header1'>MAIN MENU</h3>

          <CustomLink className='sidebar-link' href ="/dashboard" >
          <House size={22} className='sidebar-icons' />
          <span className='sidebar-label'>Dashboard</span></CustomLink> 

   

        <CustomLink className='sidebar-link' href ="/users" >
        <Users size={22} className='sidebar-icons' />
        <span className='sidebar-label'> Users </span></CustomLink>

        <CustomLink className='sidebar-link' href ="/admin" >
        <Users size={22} className='sidebar-icons' />
        <span className='sidebar-label'> Admins </span></CustomLink>

        <CustomLink className='sidebar-link' href ="/pqs" >
        <CircleEllipsis size={22} className='sidebar-icons' />
        <span className='sidebar-label'> Pending Queues </span></CustomLink>


        <CustomLink className='sidebar-link' href ="/acc" >
        <UserPlus size={22} className='sidebar-icons' />
        <span className='sidebar-label'> Add Account </span></CustomLink>

        <CustomLink className='sidebar-link' href ="/LogHis" >
        <History size={22} className='sidebar-icons' />
        <span className='sidebar-label'> Login History </span></CustomLink>

        <CustomLink className='sidebar-link' href ="/fdbck" >
        <MessageSquareText size={22} className='sidebar-icons' />
        <span className='sidebar-label'> Feedback </span></CustomLink>

      </div>

        <div className="config-pages">  
  
     
            <CustomLink className="sidebar-link" href ="/sts">
            <Settings size={22} className='sidebar-icons'/>
            <span className='sidebar-label'>Settings </span></CustomLink>
 
            <CustomLink className="sidebar-link" href="/" onClick={() => {
            console.log("User logged out successfully");
            }}>
            <LogOut size={22} className="sidebar-icons" flip="horizontal" />
            <span className="sidebar-label">Log out</span>
            </CustomLink>
           </div>
     
        </div>
    </div>

    
)
}

export default Sidebar

