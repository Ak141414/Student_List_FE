
import { Typography } from '@mui/material';

import Avatar from '@mui/material/Avatar';



function Sidebar() {
  return (
    <div className="Sidebar">
    <div className='Sidebar-content'>
    <Avatar alt="Yellow Owl" src="Yellowowl.png" />
    <div className='user-name'>
    <Typography variant="h6" > Yellow Owl</Typography>
    <Typography  variant="overline" display="block">Admin</Typography>
    </div>
    </div>
     
    </div>
  );
}

export default Sidebar;
