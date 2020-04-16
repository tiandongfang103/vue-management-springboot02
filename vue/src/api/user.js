import request from '../utils/request';

export const fetchData = query => {
    return request({
        url: '/rest/user/page',
        method: 'post',
        data: query
    });
};