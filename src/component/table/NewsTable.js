import React, {useEffect} from 'react';
import { withRouter } from "react-router";
import { connect } from 'react-redux';
import { createNews, loadNewses, deleteNews, newsListSelector } from '../../actions/news';
import { loadUsers, userListSelector } from '../../actions/users';

import MaterialTable from 'material-table';
import moment from 'moment';
import { useTranslate } from "react-translate";

function NewsTable({
    createNews,
    loadNewses,
    deleteNews,
    loadUsers,
    userList,
    columns,
    data,
    history,
    lang
}) {
    let t = useTranslate("News");
    useEffect(()=>{
        loadUsers();
    }, [])
    const handleCellClick = (event, row) => {
        history.push(`/editNews/${row.id}`)
    }
    return (
        <MaterialTable
            title={t(`news_title-${lang}`)}
            columns={columns}
            data={data}
            onRowClick={handleCellClick}
            editable={{
                onRowAdd: async newData => {
                    const userId = userList.find(user=>user.email === localStorage.getItem('email')).id;
                    await createNews({created_at: moment().format("YYYY-MM-DD"), org_id: localStorage.getItem('org_id'), author: userId, ...newData});
                    await loadNewses();
                },
                onRowDelete: async oldData => {
                    await deleteNews(oldData.id);
                    await loadNewses();
                }
            }}
            options={{
                headerStyle: {
                    backgroundColor: '#673ab7',
                    color: '#FFF',
                    padding: "10px"
                },
                rowStyle: {
                    backgroundColor: '#EEE',
                },
                searchFieldStyle: {
                    fontSize: "1.3rem",
                    width: "100%",
                },
            }}
        />
    )
}

const mapStateToProps = state => ({
    newsList: newsListSelector(state),
    userList: userListSelector(state)
});

const mapDispatchToProps = {
    createNews, 
    loadNewses, 
    deleteNews,
    loadUsers
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(NewsTable));