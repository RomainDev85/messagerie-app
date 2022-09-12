import React from 'react'
import ListChat from './ListChat'
import SearchFriendSidebar from './SearchFriendSidebar'

export default function Sidebar() {
    return (
        <div className='sidebar'>
            <SearchFriendSidebar />
            <ListChat />
        </div>
    )
}
