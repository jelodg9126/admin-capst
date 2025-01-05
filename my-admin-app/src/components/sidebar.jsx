import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { fa1 } from '@fortawesome/free-solid-svg-icons'
import { fa2 } from '@fortawesome/free-solid-svg-icons'
import { fa3 } from '@fortawesome/free-solid-svg-icons'
import { faGear } from '@fortawesome/free-solid-svg-icons'
import { Link, useLocation } from "react-router-dom";

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
        <div className="title">SmartQueues.</div>
        <div className="pages">
          <div className='dashi'>
            <h3 className='winn-header'>MAIN MENU</h3>
        <CustomLink href ="/dashboard" className='sidebar-link'>
        <FontAwesomeIcon icon={faHome} className='home-icon' />
        <span className='dash'>Dashboard</span></CustomLink> 
        </div>
        <CustomLink href ="/users" className='sidebar-link'>
        <FontAwesomeIcon icon={faUser} className='user-icon' />
        <span className='dash'> Users </span></CustomLink>
        </div>
        <div className="windows">
          <h4 className="win-header">FINANCE WINDOW</h4>
         
         <CustomLink href="/" className='sidebar-link'>
         <FontAwesomeIcon icon={fa1} className='one'/>
         <span className='dash'> Window 1 </span></CustomLink>
         <CustomLink href="/win2" className='sidebar-link'>
         <FontAwesomeIcon icon={fa2} className='one' />
         <span className='dash'>Window 2 </span></CustomLink>
         <CustomLink href="/win3" className='sidebar-link'>
         <FontAwesomeIcon icon={fa3} className='one' />
         <span className='dash'>Window 3</span></CustomLink>

         <CustomLink className="settings" href ="/settings">
         <FontAwesomeIcon icon={faGear} className='one'/>
         <span className='dash'> Settings </span></CustomLink>

         <CustomLink className="logout" href ="/e">
         <FontAwesomeIcon icon={faArrowRightFromBracket} flip="horizontal" className='one' />
         <span className='dash'> Log out</span></CustomLink>
        </div>
        </div>
    </div>
    
)
}

export default Sidebar
