import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classes from './star-count.module.css'

export interface StarCountProps {
    count: number
}

const StarCount = ({ count }: StarCountProps) => (
    <span className={classes.starInfo}>
        <FontAwesomeIcon icon="star" className={classes.star} size="sm" />
        {count}
    </span>
)

export default StarCount
