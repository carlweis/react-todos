App = React.createClass({
  // This mixin makes the getMeteorData method work
  mixins: [ReactMeteorData],

  getInitialState() {
    return {
      hideCompleted: false
    }
  },
  // Loads items from the Tasks collection and puts them on this.data
  getMeteorData() {
    let query = {};

    if (this.state.hideCompleted) {
      query = {checked: {$ne: true}};
    }
    return {
      tasks: Tasks.find(query, {sort: {createdAt: -1}}).fetch(),
      incompleteCount: Tasks.find({checked: {$ne: true}}).count(),
      currentUser: Meteor.user()
    }
  },
  renderTasks() {
    return this.data.tasks.map((task) => {
        const currentUserId = this.data.currentUser && this.data.currentUser._id;
        const isTaskOwner = task.owner == currentUserId;
        return <Task key={task._id} task={task}
                isTaskOwner={isTaskOwner} />;
    });
  },
  renderForm() {
    return (
      <form className="new-task" onSubmit={this.handleSubmit} >
        <input type="text"
               ref="textInput"
               placeholder="Type to add new tasks"/>
      </form>
    );
  },
  renderHideCompleted() {
    return (
      <label className="hide-completed">
        <input type="checkbox"
               readOnly={true}
               checked={this.state.hideCompleted}
               onClick={this.toggleHideCompleted} />
             Hide Completed Tasks
      </label>
    );
  },
  toggleHideCompleted() {
    this.setState({
      hideCompleted: ! this.state.hideCompleted
    });
  },
  handleSubmit(event) {
    event.preventDefault();

    // Find the text field via the React ref
    let text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

    // Insert a new task
    Meteor.call("addTask", text);

    // Clear form
    ReactDOM.findDOMNode(this.refs.textInput).value = "";
  },
  render() {
    return (
      <div className="container">
        <header>
          <h1>Todos React ({this.data.incompleteCount})</h1>
          {this.renderHideCompleted()}

          <AccountsUI></AccountsUI>
          {this.data.currentUser ?
            this.renderForm() : ''
          }
        </header>
        <ul>
          {this.renderTasks()}
        </ul>
      </div>
    );
  }
});
