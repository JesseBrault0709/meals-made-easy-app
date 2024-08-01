import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classes from './user-icon-and-name.module.css'

export interface UserIconAndNameProps {
    username: string
}

const UserIconAndName = ({ username }: UserIconAndNameProps) => (
    <span className={classes.userInfo}>
        <FontAwesomeIcon icon="user" className={classes.userIcon} />
        {username}
    </span>
)

export default UserIconAndName
