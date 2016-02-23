// Task compoent - represents a single todo item
Task = React.createClass({
  propTypes: {
    // This components gets the task to display through a React prop.
    // We can use propTypes to indicate it is required
    task: React.PropTypes.object.isRequired,
    isTaskOwner: React.PropTypes.bool.isRequired
  },
  toggleChecked() {
    // Set the checked property to the opposite of it's current value
    Meteor.call("setChecked", this.props.task._id, ! this.props.task.checked);
  },
  togglePrivate() {
    Meteor.call("setPrivate", this.props.task._id, ! this.props.task.private);
  },
  deleteTask() {
    Meteor.call("removeTask", this.props.task._id);
  },
  render() {
    const taskClassName = (this.props.task.checked ? "checked" : "") + " " +
      (this.props.task.private ? "private" : "");
    return (
      <li className={taskClassName}>
        { this.props.isTaskOwner ? (
          <button className="delete" onClick={this.deleteTask}>&times;</button>
        ) : ''}


        <input type="checkbox"
               readOnly={true}
               checked={this.props.task.checked}
               onClick={this.toggleChecked} />
             { this.props.isTaskOwner ? (
               <button className="toggle-private" onClick={this.togglePrivate}>
                 { this.props.task.private ? "Private" : "Public" }
               </button>
             ) : ''}
         <span className="text">
           <strong>{this.props.task.username}</strong>:&nbsp;
           {this.props.task.text}
         </span>
      </li>
    );
  }
});
