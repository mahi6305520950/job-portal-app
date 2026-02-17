
import  supabaseClient from "@/utils/supabase";


export async function getJobs(
  token,
  { location, company_id, searchQuery, page = 1, limit }
) {
  const supabase = await supabaseClient(token);

  let query = supabase
    .from("jobs")
    .select(
      `
      *,
      company:companies(name, logo_url),
      saved:saved_jobs!left(user_id, job_id)
      `,
      { count: "exact" }
    ); 

  // filters
  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`);
  }

  if (location) {
    query = query.ilike("location", `%${location}%`);
  }

  if (company_id) {
    query = query.eq("company_id", company_id);
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) {
    console.error("Error fetching jobs:", error);
    return { data: [], count: 0 };
  }

  const normalized = data.map((job) => ({
    ...job,
    saved: Array.isArray(job.saved)
      ? job.saved
      : job.saved
      ? [job.saved]
      : [],
  }));

  return {
    data: normalized,
    count,
  };
}




export async function saveJob(token,{alreadySaved},saveData) {
    const supabase=await supabaseClient(token)  
    
    if(alreadySaved){
        const {data,error:deleteError} = await supabase
        .from('saved_jobs')
        .delete()
        .eq('job_id',saveData.job_id)
        .eq("user_id", saveData.user_id);

        if (deleteError) {
        console.error('Error Deleting saved job:', deleteError);
        return null;
    }
        return data;
    }else{
        const {data,error:insertError} = await supabase
        .from('saved_jobs')
        .insert([saveData])
        .select();
        if (insertError) {
        console.error('Error Inserting saved job:', insertError);
        return null;
    }
        return data;
    }
}

export async function getSingleJob(token,{job_id}) {
    const supabase=await supabaseClient(token)  
    const {data,error} = await supabase.from('jobs')
    .select('*,company:companies(name, logo_url), applications:applications("*")')
    .eq("id",job_id)
    .single();
    if (error) {
        console.error('Error fetching Job:', error);
        return null;
    }
    return data;
}


export async function updateHiringStatus(token,{job_id},isOpen) {
    const supabase=await supabaseClient(token)  
    const {data,error} = await supabase.from('jobs')
    .update({isOpen})
    .eq("id",job_id)
    .select();
    if (error) {
        console.error('Error updating Job:', error);
        return null;
    }
    return data;
}




export async function GetSavedJobs(token) {
    const supabase=await supabaseClient(token)  
    const {data,error} = await supabase.from('saved_jobs')
    .select("*,job:jobs(*,company:companies(name,logo_url))");
    if (error) {
        console.error('Error Fetching Saved Jobs:', error);
        return null;
    }
    return data;
}

export async function GetMyJobs(token,{recruiter_id}) {
    const supabase=await supabaseClient(token)  
    const {data,error} = await supabase.from('jobs')
    .select("*,company:companies(name,logo_url)")
    .eq("recruiter_id",recruiter_id);
    if (error) {
        console.error('Error Fetching Jobs:', error);
        return null;
    }
    return data;
}


export async function DeleteJob(token,{job_id}) {
    const supabase=await supabaseClient(token)  
    const {data,error} = await supabase.from('jobs')
    .delete()
    .eq("id",job_id)
    .select();
    
    if (error) {
        console.error('Error Deleting Job:', error);
        return null;
    }
    return data;
}


