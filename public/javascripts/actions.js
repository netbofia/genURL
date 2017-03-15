$(document).ready(function(){
  //Must deal with resizing This becomes fixed for the session

  $('button').on('click',function(){
    $(this).attr('path');
    path=$(this).attr('path');
    $.ajax({
      url: "/ls",
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({path:path,up:true}),
      success: function(data,textStatus,jqXHR){
        console.log(data);
        $('button').attr('path',data.origin);
        $('table tr').empty();
        for( row in data.dirs){
          var tr='<tr class="row"><td style="width:100%; "path="'+data.origin+'/'+data.dirs[row]+'"><img class="float-left" style="width:25px;margin:10px;" src="/images/folder.png"><p class="float-left" style="margin:10px;">'+data.dirs[row]+'</p></td></tr>';
          $('table tbody').append(tr);
        }
        for( row in data.files){
          var tr='<tr class="row"><td style="width:100%;"><img class="float-left" style="width:25px;margin:10px;" src="/images/file.png"><p class="float-left" style="margin:10px;">'+data.files[row]+'</p></td></tr>';
          $('table tbody').append(tr);
        }
        rows();
      }
    });
  })
  function rows(){
    //Set for rows dirs only
    $('table td').on('dblclick',function(){
      path=$(this).attr('path');
      $.ajax({
        url: "/ls",
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({path:path,up:false}),
        success: function(data,textStatus,jqXHR){
          console.log(data);
          $('button').attr('path',data.origin);
          $('table tr').empty();
          for( row in data.dirs){
            var tr='<tr class="row"><td style="width:100%;" path="'+data.origin+'/'+data.dirs[row]+'"><img class="float-left" style="width:25px;margin:10px;" src="/images/folder.png"><p class="float-left" style="margin:10px;">'+data.dirs[row]+'</p></td></tr>';
            $('table tbody').append(tr);
          }
          for( row in data.files){
            var tr='<tr class="row"><td style="width:100%;"><img class="float-left" style="width:25px;margin:10px;" src="/images/file.png"><p class="float-left" style="margin:10px;">'+data.files[row]+'</p></td></tr>';
            $('table tbody').append(tr);
          }
          rows();
        }
      });
    })
  };
  rows();

})