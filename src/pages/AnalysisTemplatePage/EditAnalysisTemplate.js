import React, {useEffect} from 'react';
import { connect } from 'react-redux';
import { loadAnalysisTemplates, analysisTemplateListSelector } from '../../actions/analysisTemplate';
import { isLoading } from '../../actions/loading';

import { AnalysisTemplateTable } from '../../component/table';
import { useTranslate } from "react-translate";

function EditAnalysisTemplate({
    loadAnalysisTemplates,
    analysisTemplateList,
    loading,
    lang,
    match
}) {
    let t = useTranslate("AnalysisTemplate");
    const id = match.params.id;
    useEffect(()=>{
        loadAnalysisTemplates();
    },[])
    const analysisTemplates = localStorage.getItem('org_id') === "-1" ? analysisTemplateList : analysisTemplateList.filter(analysisTemplate=>analysisTemplate.org_id === localStorage.getItem("org_id") && analysisTemplate.template_id === id);
    var data=[];
    const unitLookup = {
        0 : "mg/l",
        1 : "°dH"
    };
    const publicLookup = {
        0 : "Yes",
        1 : "No"
    };
    var sortedanalysisTemplates = analysisTemplates.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));

    for(var i=0; i<sortedanalysisTemplates.length; i++) {
        data[i]={
            id: sortedanalysisTemplates[i].id,
            name: sortedanalysisTemplates[i].name,
            category: sortedanalysisTemplates[i].category,
            unit: sortedanalysisTemplates[i].unit,
            comment: sortedanalysisTemplates[i].comment,
            public: sortedanalysisTemplates[i].public
        }
    }
    const columns = [
        { title: t(`name-${lang}`), field: 'name' },
        { title: t(`category-${lang}`), field: 'category'},
        { title: t(`unit-${lang}`), field: 'unit', lookup: unitLookup},
        { title: t(`comment-${lang}`), field: 'comment'},
        { title: t(`public-${lang}`), field: 'public', lookup: publicLookup}
    ];
    return loading ? (<div>loading...</div>) : (
        <AnalysisTemplateTable 
            columns={columns}
            data={data} 
            lang={lang}
            id={id}
        />
    )
}

const mapStateToProps = state => ({
    analysisTemplateList: analysisTemplateListSelector(state),
    loading: isLoading(loadAnalysisTemplates)(state),
});

const mapDispatchToProps = {
    loadAnalysisTemplates
};

export default connect(mapStateToProps, mapDispatchToProps)(EditAnalysisTemplate);