$(document).ready(function(){
  //Must deal with resizing This becomes fixed for the session

  var loadingWidth=$('body').width();
  $('body').prepend("<div><p>"+loadingWidth+"</p></div>");
  $('button.upDir').on('click',function(){
    $(this).attr('path');
    path=$(this).attr('path');
    $.ajax({
      url: "/ls",
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({path:path,up:true}),
      success: function(data,textStatus,jqXHR){
        console.log(data);
        //Bad practise.
        $('button.upDir').attr('path',data.origin);
        $('table tr').empty();
        for( row in data.dirs){
          var tr='<tr class="row"><td class="folder" style="width:100%; "path="'+data.origin+'/'+data.dirs[row]+'"><img class="float-left" style="width:25px;margin:10px;" src="/images/folder.png"><p class="float-left" style="margin:10px;">'+data.dirs[row]+'</p></td></tr>';
          $('table tbody').append(tr);
        }
        for( row in data.files){
          var tr='<tr class="row"><td class="file" style="width:100%;"><img class="float-left" style="width:25px;margin:10px;" src="/images/file.png"><p class="float-left" style="margin:10px;">'+data.files[row]+'</p></td></tr>';
          $('table tbody').append(tr);
        }
        $('button.nav:last()').remove();
        rows();
      }
    });
  })
  function rows(){
    //Set for rows dirs only
    $('table td.folder').on('click',function(){

      path=$(this).attr('path');
      $.ajax({
        url: "/ls",
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({path:path,up:false}),
        success: function(data,textStatus,jqXHR){
          console.log(data);
          $('button.upDir').attr('path',data.origin);
          $('table tr').empty();
          for( row in data.dirs){
            var tr='<tr class="row"><td class="folder" style="width:100%;" path="'+data.origin+'/'+data.dirs[row]+'"><img class="float-left" style="width:25px;margin:10px;" src="/images/folder.png"><p class="float-left" style="margin:10px;">'+data.dirs[row]+'</p></td></tr>';
            $('table tbody').append(tr);
          }
          for( row in data.files){
            var tr='<tr class="row"><td class="file" style="width:100%;" path="'+data.origin+'/'+data.files[row]+'"><img class="float-left" style="width:25px;margin:10px;" src="/images/file.png"><p class="float-left" style="margin:10px;">'+data.files[row]+'</p><img class="shareFile float-right" style="width:25px;margin:10px;" src="/images/share.png"></td></tr>';
            $('table tbody').append(tr);
          }
          rows();
          //Add sharing to new elements
          share();
        }
      });
    })
  };
  rows();
  function share(){
    $('tbody .shareFile').popover('dispose');
    $('tbody .shareFile').on('click',function(){
        that=$(this);
        path=$(this).closest('td').attr('path');
        console.log(path);
        auth="1q2222222342we3we";
        $.ajax({
          url: "/share",
          type: 'POST',
          that:that,
          contentType: 'application/json',
          data: JSON.stringify({path:path,auth:auth}),
          success: function(data,textStatus,jqXHR){
            var that = this.that;
            that.popover({content:data.link,placement:'left',title:'Sharing link'});
            that.popover('show');
            console.log(data);
  
          }
        });
    })
  }
  share();
  $("table.permissionsTable .actions img.removeShare").on('click',function(){
   var that=$(this);
   var alert=$('tr.alertRemove').clone().show();
   that.closest('tr').prev('tr').show();
  })
  $("tr.alertRemove .btn.yes").on('click',function(){
   var that = $(this); 
   var hash=$(this).closest('tr').next("tr").children('td.hash').contents('p.hash').text()  
   $.ajax({
    url: "/delete",
    type: 'POST',
    that:that,
    contentType: 'application/json',
    data: JSON.stringify({hash:hash}),
    success: function(data,textStatus,jqXHR){
      var that = this.that;
      that.closest('tr').remove();
      that.closest('tr').next('tr').remove();
      }
    });
    
  })


})