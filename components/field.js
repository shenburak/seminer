/* eslint-disable react/prop-types */
import TextField from '@material-ui/core/TextField';
export default function Field(props) {
    return (
        <div>
            <TextField type={props.type} id="outlined-basic"
                autoComplete={props.autoComplete}
                onChange={props.onChange}
                id={[props.name, 'input'].join('-')}
                name={props.name}
                value={props.value}
                required={props.required} label={props.label} variant="outlined" fullWidth={props.fullWidth} />
        </div>
    )
}