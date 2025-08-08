
export const useMovieData = () => {
  const featuredMovies = [
    {
      title: "Spider-Man: No Way Home",
      description: "Peter Parker bị lộ danh tính Spider-Man và không thể tách biệt cuộc sống bình thường với việc làm siêu anh hùng. Khi anh yêu cầu Doctor Strange giúp đỡ, mọi thứ trở nên nguy hiểm hơn bao giờ hết...",
      rating: 8.4,
      year: 2021,
      duration: "148 phút",
      backgroundImage: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=1200&h=600&fit=crop"
    },
    {
      title: "Avatar: The Way of Water",
      description: "Jake Sully sống cùng gia đình mới trên hành tinh Pandora. Khi một mối đe dọa quen thuộc trở lại để hoàn thành những gì đã bắt đầu trước đây, Jake phải làm việc với Neytiri và quân đội của chủng tộc Na'vi để bảo vệ hành tinh của họ.",
      rating: 7.6,
      year: 2022,
      duration: "192 phút",
      backgroundImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=600&fit=crop"
    },
    {
      title: "Black Panther: Wakanda Forever",
      description: "Nữ hoàng Ramonda, Shuri, M'Baku, Okoye và Dora Milaje chiến đấu để bảo vệ quốc gia của họ khỏi các thế lực can thiệp sau cái chết của Vua T'Challa. Khi người Wakanda cố gắng nắm bắt chương tiếp theo của họ...",
      rating: 6.7,
      year: 2022,
      duration: "161 phút",
      backgroundImage: "https://lumiere-a.akamaihd.net/v1/images/pp_disney_blackpanther_wakandaforever_1289_d3419b8f.jpeg"
    },
    {
      title: "The Batman",
      description: "Khi một kẻ giết người nhắm mục tiêu vào những người có quyền lực ở Gotham City với những manh mối tinh vi, Batman phải đi sâu vào thế giới ngầm để theo dõi manh mối và mang công lý cho những kẻ lạm dụng quyền lực và tham nhũng...",
      rating: 7.8,
      year: 2022,
      duration: "176 phút",
      backgroundImage: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=1200&h=600&fit=crop"
    }
  ];

  const movies = [
    {
      title: "Top Gun: Maverick",
      poster: "https://play-lh.googleusercontent.com/UJHa0DJftoFAt7rj1M8w7OmVoPxcFoRJAAqV2hbbz8QI-p5xHTxbjidNKM7gE-jxKzDfCuCfIJ7VBxQIcQ=w240-h480-rw",
      rating: 8.3,
      year: 2022,
      genre: "Hành động",
      type: "Phim Lẻ",
      country: "Nước ngoài"
    },
    {
      title: "Avatar: The Way of Water",
      poster: "https://m.media-amazon.com/images/M/MV5BNmQxNjZlZTctMWJiMC00NGMxLWJjNTctNTFiNjA1Njk3ZDQ5XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
      rating: 7.8,
      year: 2022,
      genre: "Sci-Fi",
      type: "Phim Lẻ",
      country: "Nước ngoài"
    },
    {
      title: "Black Panther",
      poster: "https://upload.wikimedia.org/wikipedia/en/d/d6/Black_Panther_%28film%29_poster.jpg",
      rating: 7.3,
      year: 2018,
      genre: "Hành động",
      type: "Phim Lẻ",
      country: "Nước ngoài"
    },
    {
      title: "Dune",
      poster: "https://m.media-amazon.com/images/M/MV5BMDQ0NjgyN2YtNWViNS00YjA3LTkxNDktYzFkZTExZGMxZDkxXkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_FMjpg_UX1000_.jpg",
      rating: 8.0,
      year: 2021,
      genre: "Sci-Fi",
      type: "Phim Lẻ",
      country: "Nước ngoài"
    },
    {
      title: "No Time to Die",
      poster: "https://m.media-amazon.com/images/M/MV5BZGZiOGZhZDQtZmRkNy00ZmUzLTliMGEtZGU0NjExOGMxZDVkXkEyXkFqcGc@._V1_QL75_UX190_CR0,0,190,281_.jpg",
      rating: 7.4,
      year: 2021,
      genre: "Hành động",
      type: "Phim Lẻ",
      country: "Nước ngoài"
    },
    {
      title: "The Batman",
      poster: "https://upload.wikimedia.org/wikipedia/vi/0/07/Batman_2022_CGV.jpg",
      rating: 7.8,
      year: 2022,
      genre: "Hành động",
      type: "Phim Lẻ",
      country: "Nước ngoài"
    },
    {
      title: "Game of Thrones",
      poster: "https://m.media-amazon.com/images/M/MV5BN2IzYzBiOTQtNGZmMi00NDI5LTgxMzMtN2EzZjA1NjhlOGMxXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_FMjpg_UX1000_.jpg",
      rating: 9.2,
      year: 2011,
      genre: "Fantasy",
      type: "TV Shows",
      country: "Nước ngoài"
    },
    {
      title: "Stranger Things",
      poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwPKlpSF1q_Gw4Txv9sjUoJFAYRsNgMqZGdw&s",
      rating: 8.7,
      year: 2016,
      genre: "Sci-Fi",
      type: "TV Shows",
      country: "Nước ngoài"
    },
    {
      title: "Breaking Bad",
      poster: "https://m.media-amazon.com/images/M/MV5BYmQ4YWMxYjUtNjZmYi00MDQ1LWFjMjMtNjA5ZDdiYjdiODU5XkEyXkFqcGdeQXVyMTMzNDExODE5._V1_FMjpg_UX1000_.jpg",
      rating: 9.5,
      year: 2008,
      genre: "Drama",
      type: "TV Shows",
      country: "Nước ngoài"
    },
    {
      title: "The Witcher",
      poster: "https://m.media-amazon.com/images/M/MV5BMTQ5MDU5MTktMDZkMy00NDU1LWIxM2UtODg5OGFiNmRhNDBjXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
      rating: 8.2,
      year: 2019,
      genre: "Fantasy",
      type: "TV Shows",
      country: "Nước ngoài"
    },
    {
      title: "Bố Già",
      poster: "https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/1800x/71252117777b696995f01934522c402d/b/o/bogia_mainposter_digital_lite_1_.jpg",
      rating: 7.2,
      year: 2021,
      genre: "Hài hước",
      type: "Phim Lẻ",
      country: "Việt Nam"
    },
    {
      title: "Hai Phượng",
      poster: "https://homepage.momocdn.net/cinema/momo-cdn-api-220615130952-637908953921767257.jpg",
      rating: 6.8,
      year: 2019,
      genre: "Hành động",
      type: "Phim Lẻ",
      country: "Việt Nam"
    },
    {
      title: "Cô Ba Sài Gòn",
      poster: "https://baokhanhhoa.vn/file/e7837c02857c8ca30185a8c39b582c03/dataimages/201803/original/images5328695_2.jpg",
      rating: 7.5,
      year: 2017,
      genre: "Tình cảm",
      type: "Phim Lẻ",
      country: "Việt Nam"
    },
    {
      title: "Thiên Linh Cái",
      poster: "https://imgcdn.tapchicongthuong.vn/thumb/w_1000/tcct-media/19/9/18/phim-thien-linh-cai2.jpg",
      rating: 6.9,
      year: 2021,
      genre: "Kinh dị",
      type: "Phim Lẻ",
      country: "Việt Nam"
    },
    {
      title: "Lật Mặt: 48H",
      poster: "https://upload.wikimedia.org/wikipedia/vi/6/62/L%E1%BA%ADt_m%E1%BA%B7t_48h_poster.jpg",
      rating: 7.1,
      year: 2021,
      genre: "Hành động",
      type: "Phim Lẻ",
      country: "Việt Nam"
    },
    {
      title: "Về Nhà Đi Con",
      poster: "https://danviet.ex-cdn.com/files/f1/upload/2-2019/images/2019-06-04/Ve-nha-di-con-duoc-tang-so-tap-va-thoi-gian-dong-may-du-kien-dai-hon-56485547_2574630002822221_2523342287681880064_n-1559624631-width960height960.jpg",
      rating: 8.8,
      year: 2019,
      genre: "Gia đình",
      type: "Phim Bộ",
      country: "Việt Nam"
    },
    {
      title: "Hướng Dương Ngược Nắng",
      poster: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2021/3/27/893367/Huong-Duong-Nguoc-Na-01.jpg",
      rating: 7.9,
      year: 2022,
      genre: "Tình cảm",
      type: "Phim Bộ",
      country: "Việt Nam"
    },
    {
      title: "Nữ Hoàng Băng Giá 2",
      poster: "https://upload.wikimedia.org/wikipedia/vi/thumb/8/8c/Frozen2phim.jpg/250px-Frozen2phim.jpg",
      rating: 6.8,
      year: 2019,
      genre: "Hoạt hình",
      type: "Phim Lẻ",
      country: "Nước ngoài"
    },
    {
      title: "Minions: The Rise of Gru",
      poster: "https://m.media-amazon.com/images/M/MV5BZTAzMTkyNmQtNTMzZS00MTM1LWI4YzEtMjVlYjU0ZWI5Y2IzXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
      rating: 6.5,
      year: 2022,
      genre: "Hoạt hình",
      type: "Phim Lẻ",
      country: "Nước ngoài"
    }
  ];

  return { featuredMovies, movies };
};
