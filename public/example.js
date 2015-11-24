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
  /*rawMarkup: function() {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return { __html: rawMarkup };
  },*/
  
    handleAttendSubmit: function(event) {
    
      $.ajax({
      url: 'api/:id/bars/attend/',
      dataType: 'json',
      type: 'POST',
      data: {url:this.props.url},
      success: function(data) {
        //this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        //this.setState({data: locations});
        console.error(this.props.url, status, err.toString());
      }.bind(this)
      });
      
    },

  
  /*handleClick: function(event) {
    //alert("clicked")
    this.props.attend.push(1)
    this.setState(this.props.attend)
    
    
  },*/

  render: function() {
    return (
      <div className="BarListItem">
        <img src={this.props.image_url}/>
        <div>
          <a href={this.props.url} target='_blank'>{this.props.barName}</a><br/>
          {this.props.snippet}
          {/*<span dangerouslySetInnerHTML={this.rawMarkup()} />*/}
          
          <p className="Attending" title='Attending?' onClick={this.handleAttendSubmit}>
            {this.props.attend.length}
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
        //alert(data);
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
    /*setInterval(this.loadCommentsFromServer, this.props.pollInterval);*/
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
    //alert(this.props.data[0].snippet);
    var barNodes = this.props.data.map(function(bar) {
      return (
        <TheBar
          barName={bar.name}
          url={bar.url}
          image_url={bar.image_url}
          snippet={bar.snippet}
          attend={bar.attending}
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
    //var text = this.state.text.trim();
    var text = this.state.text;
    if (!text) {
      return;
    }
    this.props.onLocationSubmit({text: text});
    //this.setState({text: ''});
  },
  componentDidMount: function() {
    this.loadLocationFromServer();
    /*setInterval(this.loadCommentsFromServer, this.props.pollInterval);*/
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
  //<CommentBox url="api/:id/comments" /*pollInterval={2000}*/ />,
  <LocationBox url="api/:id/location" /*pollInterval={2000}*/ />,
  document.getElementById('content')
);