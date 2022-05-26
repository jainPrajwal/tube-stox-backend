     /playslists GET all playlists for a user USER DONE
     /playlists POST CREATE playlist for a user USER DONE

     /playlists/:playlistId UPDATE playlist with playlistId (user can change name) DONE
     /playlists/:playlistId DELETE playlist with playlistId (user can delete playlist) DONE

     /playlists/:type/videos GET all the videos type of playlist for user DONE


     /playlists/:playlistId/videos/:videoId POST update a video in playlist DONE
     /playlists/:playlistId/videos/:videoId DELETE delete a video in playlist DONE

     /videos GET all videos FOR ALL USER DONE
     /videos POST CREATE video by user USER DONE
     /videos/:videoId POST UPDATE video with videoId DONE
     /videos/:videoId DELETE video with videoId (Only if he is the publisher of that video) DONE


     /videos/:videoId/notes GET all notes on that video by user USER
     /videos/:videoId/notes POST CREATE notes on that video by user USER
     /videos/:videoId/notes/:noteId POST UPDATE notes on that video by notesId USER


     /profile GET all videos, GET all playlists USER DONE
     /profile POST UPDATE user profile USER 

     /login POST Login In User USER DONE
     /signup POST Register Users USER DONE
