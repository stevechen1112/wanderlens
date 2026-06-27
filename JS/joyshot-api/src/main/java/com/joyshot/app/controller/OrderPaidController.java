package com.joyshot.app.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;


@Controller
@RequestMapping("/api/order-paid")
public class OrderPaidController {


	@Value("${ecpay.client-redirect-url}")
	private String ECPAY_CLIENT_REDIRECT_URL;

	/**
	 * 交易結果轉交前台
	 * @param request
	 * @return
	 * @throws InterruptedException
	 */
	@PostMapping("/thank-you")
	public String orderResultURL(HttpServletRequest request) throws InterruptedException {
		String code = request.getParameter("MerchantTradeNo");
		String orderNo = code.substring(0, code.length()-3);
		System.out.println("thankyou:" + orderNo);
		return "redirect:"+ ECPAY_CLIENT_REDIRECT_URL + orderNo;
	}

}
