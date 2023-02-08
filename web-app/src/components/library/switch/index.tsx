const Switch = (props: any) => (
  <label className="switch">
    <input type="checkbox" checked={props.checked} onChange={props.onChange} />
    <span className="slider round"></span>
  </label>
);

export { Switch };
