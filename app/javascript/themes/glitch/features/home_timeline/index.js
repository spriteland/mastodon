import React from 'react';
import { connect } from 'react-redux';
import { expandHomeTimeline } from 'themes/glitch/actions/timelines';
import PropTypes from 'prop-types';
import StatusListContainer from 'themes/glitch/features/ui/containers/status_list_container';
import Column from 'themes/glitch/components/column';
import ColumnHeader from 'themes/glitch/components/column_header';
import { addColumn, removeColumn, moveColumn } from 'themes/glitch/actions/columns';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import ColumnSettingsContainer from './containers/column_settings_container';
import { Link } from 'react-router-dom';

const messages = defineMessages({
  title: { id: 'column.home', defaultMessage: 'Home' },
});

const mapStateToProps = state => ({
  hasUnread: state.getIn(['timelines', 'home', 'unread']) > 0,
});

@connect(mapStateToProps)
@injectIntl
export default class HomeTimeline extends React.PureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    hasUnread: PropTypes.bool,
    columnId: PropTypes.string,
    multiColumn: PropTypes.bool,
  };

  handlePin = () => {
    const { columnId, dispatch } = this.props;

    if (columnId) {
      dispatch(removeColumn(columnId));
    } else {
      dispatch(addColumn('HOME', {}));
    }
  }

  handleMove = (dir) => {
    const { columnId, dispatch } = this.props;
    dispatch(moveColumn(columnId, dir));
  }

  handleHeaderClick = () => {
    this.column.scrollTop();
  }

  setRef = c => {
    this.column = c;
  }

  handleLoadMore = () => {
    this.props.dispatch(expandHomeTimeline());
  }

  render () {
    const { intl, hasUnread, columnId, multiColumn } = this.props;
    const pinned = !!columnId;

    return (
      <Column ref={this.setRef} name='home'>
        <ColumnHeader
          icon='home'
          active={hasUnread}
          title={intl.formatMessage(messages.title)}
          onPin={this.handlePin}
          onMove={this.handleMove}
          onClick={this.handleHeaderClick}
          pinned={pinned}
          multiColumn={multiColumn}
        >
          <ColumnSettingsContainer />
        </ColumnHeader>

        <StatusListContainer
          trackScroll={!pinned}
          scrollKey={`home_timeline-${columnId}`}
          loadMore={this.handleLoadMore}
          timelineId='home'
          emptyMessage={<FormattedMessage id='empty_column.home' defaultMessage='Your home timeline is empty! Visit {public} or use search to get started and meet other users.' values={{ public: <Link to='/timelines/public'><FormattedMessage id='empty_column.home.public_timeline' defaultMessage='the public timeline' /></Link> }} />}
        />
      </Column>
    );
  }

}
