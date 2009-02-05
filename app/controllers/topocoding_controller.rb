class TopocodingController < ApplicationController
  
  def index
    if Rails.env == "production"
      @keys = {
        :maps => "ABQIAAAA9VOSeYNzYR1HdqCp_eD-WRQarr66bWenItJtjaWW_RTRzXWo0BSMPpiHFR6gTMovamyAknbZ0oNRKg",
        :topo => "RGSDRTKBGZSMJWV"
      }
    else
      @keys = {
        :maps => "ABQIAAAA9VOSeYNzYR1HdqCp_eD-WRRA6qMlH81_n23nelqba7RlgyJneBR7iJ-ri4wGf14-6a3QJsIHUCk9Iw",
        :topo => "NBOJQVHAWKVLRUG"
      }
    end
  end
  
end