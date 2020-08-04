import React, {useEffect} from 'react';
import { connect } from 'react-redux';
import { loadTemplateLists, templateListSelector } from '../../actions/templateLists';
import { isLoading } from '../../actions/loading';

import { TemplateListTable } from '../../component/table';
import { useTranslate } from "react-translate";

function AnalysisTemplate({
    loadTemplateLists,
    templateList,
    loading,
    lang
}) {
    let t = useTranslate("AnalysisTemplate");
    useEffect(()=>{
        loadTemplateLists();
    },[])
    const analysisTemplates = localStorage.getItem('org_id') === "-1" ? templateList : templateList.filter(analysisTemplate=>analysisTemplate.org_id === localStorage.getItem("org_id"));
    var data=[];
    var sortedanalysisTemplates = analysisTemplates.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));

    for(var i=0; i<sortedanalysisTemplates.length; i++) {
        data[i]={
            id: sortedanalysisTemplates[i].id,
            name: sortedanalysisTemplates[i].name,
        }
    }
    const columns = [
        { title: t(`name-${lang}`), field: 'name', cellStyle: {textDecoration: "underline"} },
    ];
    return loading ? (<div>loading...</div>) : (
        <TemplateListTable 
            columns={columns}
            data={data} 
            lang={lang}
        />
    )
}

const mapStateToProps = state => ({
    templateList: templateListSelector(state),
    loading: isLoading(loadTemplateLists)(state),
});

const mapDispatchToProps = {
    loadTemplateLists
};

export default connect(mapStateToProps, mapDispatchToProps)(AnalysisTemplate);