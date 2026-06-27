package com.joyshot.app.util;

import com.google.maps.DirectionsApi;
import com.google.maps.GeoApiContext;
import com.google.maps.errors.ApiException;
import com.google.maps.model.DirectionsLeg;
import com.google.maps.model.DirectionsResult;
import com.google.maps.model.TravelMode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.io.IOException;

/**
 * @author avery
 */
@Service
public class MapUtil {

    @Value("${google.map-api-key}")
    private String GOOGLE_MAP_API_KEY;

    @Value("${google.map-api-lang}")
    private String API_LANG;

    /**
     *
     * @param origin: 攝影師住家地的經緯度
     * @param destination: 拍攝地點的 placeId
     * @param lang: 使用語系
     * @return
     * @throws InterruptedException
     * @throws ApiException
     * @throws IOException
     */
    public DirectionsLeg getDistinceBetween(String origin, String destination, String lang) throws InterruptedException, ApiException, IOException {

        System.out.println("origin:" + origin);
        System.out.println("destination:" + destination);

        GeoApiContext context = new GeoApiContext.Builder()
                .apiKey(GOOGLE_MAP_API_KEY)
                .build();
        if (lang == null) {
            lang = API_LANG;
        }
        DirectionsResult result = DirectionsApi.newRequest(context)
                .mode(TravelMode.DRIVING)
                .language(lang)
//                .origin("24.737451265806524,121.08718092422826")
                .origin(origin)
//                .destination("24.824040259989662,121.0238526623337")
                .destination("place_id:" + destination)
                .await();
//        System.out.println("result:" + result);
        System.out.println(result.routes[0].legs[0].distance.humanReadable + " " + result.routes[0].legs[0].distance.inMeters);
        System.out.println(result.routes[0].legs[0].duration.humanReadable + " " + result.routes[0].legs[0].duration.inSeconds);
        return result != null ? result.routes[0].legs[0] : null;
    }
}
