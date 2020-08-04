import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { loadUsers, userListSelector } from '../../actions/users';
import { isLoading } from '../../actions/loading';
import { EnhancedTable } from '../../component/table';
import moment from 'moment';
import { useTranslate } from "react-translate";

function Member({
    userList,
    loadUsers,
    loading,
    lang
}) {
    useEffect(() => {
        loadUsers();
    }, []);
    let t = useTranslate("Member");

    var data = []
    var users = localStorage.getItem('org_id') === "-1" ? userList : userList.filter(user => user.org_id === localStorage.getItem('org_id'));
    var sortedUsers = users.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
    for(var i=0; i<sortedUsers.length; i++) {
        data[i] = {
            id: sortedUsers[i].id,
            name: sortedUsers[i].name,
            role: sortedUsers[i].role,
            created_at: moment(sortedUsers[i].created_at).format(lang==="en" ? "YYYY-MM-DD" : "MM.DD.YYYY")
        }
    }
    const columns = [
            { title: t(`name-${lang}`), field: 'name', editable: 'never', cellStyle: {textDecoration: "underline"} },
            {
                title: t(`role-${lang}`),
                field: 'role',
                lookup: { 0: 'Admin',1: 'Manager', 2: 'Member' }, 
                editable: 'never', 
                disableClick: true
            },
            { title: t(`created-${lang}`), field: 'created_at', editable: 'never', disableClick: true },
        ];

    return loading ? (<div>loading...</div>) : (
        <EnhancedTable 
            columns={columns}
            data={data}
            isUserTable={true}
            isMemberTable={false}
            lang={lang}
        />
    );
}

const mapStateToProps = state => ({
    userList: userListSelector(state),
    loading: isLoading(loadUsers)(state)
});

const mapDispatchToProps = {
    loadUsers,
};

export default connect(mapStateToProps, mapDispatchToProps)(Member);