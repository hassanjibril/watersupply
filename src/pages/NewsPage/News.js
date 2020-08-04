import React, {useEffect} from 'react';
import { connect } from 'react-redux';
import { loadNewses, newsListSelector } from '../../actions/news';
import { loadUsers, userListSelector } from '../../actions/users';
import { isLoading } from '../../actions/loading';

import { NewsTable } from '../../component/table';
import moment from 'moment';
import { useTranslate } from "react-translate";

function News({
    loadNewses,
    newsList,
    loadUsers,
    userList,
    loading,
    lang
}) {
    let t = useTranslate("News");
    useEffect(()=>{
        loadUsers();
        loadNewses();
    },[])
    var users = localStorage.getItem('org_id') === "-1" ? userList : userList.filter(user => user.org_id === localStorage.getItem('org_id'));
    const newses = localStorage.getItem('org_id') === "-1" ? newsList : newsList.filter(news=>news.org_id === localStorage.getItem("org_id"));
    var data=[];
    var userLookup = {};
    for(var i=0; i<users.length; i++) {
        userLookup[users[i].id]=users[i].name;
    }
    var sortednewses = newses.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));

    for(var i=0; i<sortednewses.length; i++) {
        data[i]={
            id: sortednewses[i].id,
            title: sortednewses[i].title,
            created_at: moment(sortednewses[i].created_at).format(lang==="en" ? "YYYY-MM-DD" : "MM.DD.YYYY"),
            author: sortednewses[i].author
        }
    }
    const columns = [
        { title: t(`title-${lang}`), field: 'title', cellStyle: {textDecoration: "underline"} },
        { title: t(`created_at-${lang}`), field: 'created_at', disableClick: true, editable: 'never' },
        { title: t(`author-${lang}`), field: 'author', lookup: userLookup, disableClick: true, editable: 'never' }
    ];
    return loading ? (<div>loading...</div>) : (
        <NewsTable 
            columns={columns}
            data={data} 
            lang={lang}
        />
    )
}

const mapStateToProps = state => ({
    newsList: newsListSelector(state),
    userList: userListSelector(state),
    loading: isLoading(loadNewses)(state),
});

const mapDispatchToProps = {
    loadNewses,
    loadUsers
};

export default connect(mapStateToProps, mapDispatchToProps)(News);