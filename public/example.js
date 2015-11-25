/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var TheBar = React.createClass({
  getInitialState: function() {
    return {attendcnt: []};
  },
  componentDidMount: function() {
    this.setState({attendcnt: this.props.attendinit});
    //this.getLocationFromServer();
  },
  handleAttendSubmit: function(event) {
    $.ajax({
    url: 'api/:id/bars/attend/',
    dataType: 'json',
    type: 'POST',
    data: {url:this.props.url},
    success: function(data) {
      this.setState({attendcnt: data.attending});
    }.bind(this),
    error: function(xhr, status, err) {
      console.error(this.props.url, status, err.toString());
    }.bind(this)
    });
    
  },

  render: function() {
    return (
      <div className="BarListItem">
        <img src={this.props.image_url}/>
        <div>
          <a href={this.props.url} target='_blank'>{this.props.barName}</a><br/>
          {this.props.snippet}
          
          <p className="Attending" title='Attending?' onClick={this.handleAttendSubmit}>
            {this.state.attendcnt.length}
          </p>
        </div>
      </div>
    );
  }
});

var LocationBox = React.createClass({
  
  getLocationFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'GET',
      cache: false,
      success: function(data) {
        this.setState({data: data[0]});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
    
  },
  
  BarStart: function(location) {
      $.ajax({
      url: 'api/:id/bars/start/',
      dataType: 'json',
      type: 'GET',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });

  },
  
  handleLocationSubmit: function(location) {
    
      $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: location,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({data: locations});
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
    
    this.BarStart(location);
    
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.getLocationFromServer();
  },
  render: function() {
    return (
      <div className="LocationBox">
        <LocationForm onLocationSubmit={this.handleLocationSubmit} url="api/:id/location"/>
        <br></br>
        <BarList data={this.state.data} />
      </div>
    );
  }
});

var BarList = React.createClass({
 
  render: function() {
    var barNodes = this.props.data.map(function(bar) {
      return (
        <TheBar
          barName={bar.name}
          url={bar.url}
          image_url={bar.image_url}
          snippet={bar.snippet}
          attendinit={bar.attending}
          key={bar.url}>
        </TheBar>
      );
    });
    return (
      <div className="barList">
        {barNodes}
      </div>
    );
  }
});

var LocationForm = React.createClass({
  loadLocationFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'GET',
      cache: false,
      success: function(data) {
        this.setState({text: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {text: ''};
  },
  handleTextChange: function(e) {
    this.setState({text: e.target.value});
  },
  handleSubmit: function(e) {
    
    e.preventDefault();
    var text = this.state.text;
    if (!text) {
      return;
    }
    this.props.onLocationSubmit({text: text});
  },
  componentDidMount: function() {
    this.loadLocationFromServer();
  },
  render: function() {
    return (
      <form className="locationForm" onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder="Location?"
          value={this.state.text}
          onChange={this.handleTextChange}
        />
        <input type="submit" value="Find Bars" />
      </form>
    );
  }
});

ReactDOM.render(
  <LocationBox url="api/:id/location" />,
  document.getElementById('content')
);