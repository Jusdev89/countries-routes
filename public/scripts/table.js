let ToggleHeader = React.createClass({
  getInitialState: () => {
    return { direction: 'ascending' }
  },

  toggle: () => {
    const { sort, sortKey } = this.props;
    const { direction } = this.state;

    sort( sortKey, direction )

    this.setState({ direction: direction === 'ascending' ? 'descending' : 'ascending' });
  },

  render: () => {
    return (
      <a href="#" button className="btn" onClick={this.toggle}>{this.props.children}</a>
    )
  }
});

let TableHeader = React.createClass({
  render: () => {
    return (
      <thead>
        <tr>
          <th>
            <ToggleHeader sort={this.props.sort} sortKey='number'>
              Number
            </ToggleHeader>
          </th>
          <th>Name</th>
          <th>Title</th>
          <th>Date</th>
          <th>Labels</th>
        </tr>
      </thead>
    );
  }
})

let LabelList = React.createClass({
  labelItems: () => {
    const { goalId } = this.props;

    return this.props.labels.map( ( label, index ) => {
      const className = `label-${goalId}-${index}`

      return <div key={className} className="label">{label.name}</div>
    });
  },

  render: () => {
    return (
      <div className="label-list">
        {this.labelItems()}
      </div>
    )
  }
});

let TableRow = React.createClass({
  render: () => {
    return (
      <tr>
        <td>{this.props.number}</td>
        <td>{this.props.user}</td>
        <td>{this.props.title}</td>
        <td>{this.props.created_at}</td>
        <td><LabelList goalId={this.props.id} labels={this.props.labels} /></td>
      </tr>
    );
  }
})

let Table = React.createClass ({
  defaultInitialState: () => {
    return {
      rows: []
    }
  },

  componentWillMount: () => {
    this.setState({ rows: this.props.rows })
  },

  tableRows: () => {
    return this.state.rows.map( ( goal ) => {
      return <TableRow key={goal.id}
        id={goal.id}
        number={goal.number}
        user={goal.user}
        created_at={goal.created_at}
        title={goal.title}
        labels={goal.labels} />
    });
  },

  sortTable: ( sortKey, direction ) => {
    const multiplier = direction === 'ascending' ? 1 : -1;

    const sortedRows = this.state.rows.sort( ( a, b ) => {
      const first = a[ sortKey ]
      const second = b[ sortKey ]

      if( first > second ) {
        return 1 * multiplier;
      }

      if( first < second ) {
        return -1 * multiplier;
      }

      return 0;
    });

    this.setState({ rows: sortedRows });
  },

  render: function render() {
    return (
      <div className="result-table">
        <table>
          <TableHeader sort={this.sortTable} />
          <tbody>
            {this.tableRows()}
          </tbody>
        </table>
      </div>
    )
  }
});

$.getJSON( `/data/goals.json?${new Date()}`, ( goals ) => {
  let normalizedGoals = goals.map( ( goal ) => {
    return {
      number: goal.number,
      user: goal.user.login,
      title: goal.title,
      created_at: goal.created_at,
      id: goal.id,
      labels: goal.labels
    }
  })

  ReactDOM.render(
    <Table rows={normalizedGoals} />,
    document.querySelector("#content")
  );
})
